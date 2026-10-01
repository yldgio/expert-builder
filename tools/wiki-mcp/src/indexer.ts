import { constants as fsConstants, type Stats } from "node:fs";
import { lstat, open, readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import jsYaml from "js-yaml";
import MiniSearch from "minisearch";

export type FrontmatterValue =
  | string
  | number
  | boolean
  | null
  | FrontmatterValue[]
  | { [key: string]: FrontmatterValue };

export interface VerificationEntry {
  by: string;
  at: string;
}

export interface Concept {
  path: string;
  type: string;
  title: string;
  description: string;
  tags: string[];
  generated: VerificationEntry;
  sources: FrontmatterValue[];
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
}

export interface IndexWarning {
  path: string;
  reason: string;
}

export type Warnings = readonly IndexWarning[];

export type TrustTier = "unverified" | "machine-confirmed" | "human-reviewed";

export interface UpdateState {
  stale: boolean;
  stale_after: string | null;
  trust_tier: TrustTier;
  last_verified_at: string | null;
  days_since_verified: number | null;
  needs_review: boolean;
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  tags: string[];
}

export type GraphEdge =
  | { kind: "link"; source: string; target: string; dangling: boolean }
  | { kind: "shared-tag"; source: string; target: string; tags: string[] };

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchOptions {
  type?: string;
  tag?: string;
  limit?: number;
}

export interface SearchResult {
  path: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
  score: number;
}

export interface SweepChangedReport {
  scanned: number;
  reparsed: string[];
  removed: string[];
  warnings: IndexWarning[];
}

export interface ReindexReport {
  indexed: number;
  skipped: IndexWarning[];
  warnings: IndexWarning[];
}

export interface BuildIndexOptions {
  needsReviewDays?: number;
  now?: () => Date;
}

export interface WikiIndex {
  readonly wikiPath: string;
  readonly needsReviewDays: number;
  readonly concepts: readonly Concept[];
  readonly warnings: Warnings;
  readonly graph: Graph;
  getConcept(path: string): Concept | undefined;
  getUpdateState(path: string): UpdateState | undefined;
  search(query: string, options?: SearchOptions): SearchResult[];
}

export interface WikiIndexer extends WikiIndex {
  sweepChanged(): Promise<SweepChangedReport>;
  reindex(): Promise<ReindexReport>;
}

interface SearchDocument {
  id: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
}

interface ParsedFrontmatter {
  data: unknown;
  content: string;
}

interface FileSnapshot {
  mtimeMs: number;
  size: number;
  symbolicLink: boolean;
  dev: number;
  ino: number;
  linkCount: number;
}

interface WikiFileRead {
  source: string;
  snapshot: FileSnapshot;
}

type WikiFileReadResult =
  | WikiFileRead
  | { snapshot?: FileSnapshot; warning: IndexWarning };

type ConceptParseResult =
  | { concept: Concept; warning?: IndexWarning }
  | { warning: IndexWarning };

interface BundleIndexState {
  snapshot?: FileSnapshot;
  warning?: IndexWarning;
}

interface WikiState {
  concepts: Map<string, Concept>;
  snapshots: Map<string, FileSnapshot>;
  scanWarnings: IndexWarning[];
  bundleIndex: BundleIndexState;
  skipped: IndexWarning[];
  warnings: IndexWarning[];
}

const reservedFiles = new Set(["index.md", "log.md"]);
const mandatoryFields = ["type", "title", "description", "generated", "sources"] as const;
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const readOnlyNoFollowFlags = fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0);

class InMemoryWikiIndex implements WikiIndexer {
  readonly wikiPath: string;
  readonly needsReviewDays: number;
  private readonly conceptMap: Map<string, Concept>;
  private readonly warningList: IndexWarning[];
  private readonly now: () => Date;
  private graphValue: Graph;
  private searchIndex: MiniSearch<SearchDocument>;
  private fileSnapshots: Map<string, FileSnapshot>;
  private scanWarningPaths: Set<string>;
  private bundleIndexSnapshot: FileSnapshot | undefined;
  private lifecycleTail: Promise<void> = Promise.resolve();

  constructor(
    wikiPath: string,
    needsReviewDays: number,
    now: () => Date,
    state: WikiState,
  ) {
    this.wikiPath = wikiPath;
    this.needsReviewDays = needsReviewDays;
    this.now = now;
    this.conceptMap = state.concepts;
    this.warningList = state.warnings;
    this.fileSnapshots = state.snapshots;
    this.scanWarningPaths = new Set(state.scanWarnings.map(({ path: filePath }) => filePath));
    this.bundleIndexSnapshot = state.bundleIndex.snapshot;
    this.graphValue = buildGraph([...state.concepts.values()]);
    this.searchIndex = buildSearchIndex([...state.concepts.values()]);
  }

  get concepts(): readonly Concept[] {
    return [...this.conceptMap.values()].sort((left, right) =>
      left.path.localeCompare(right.path),
    );
  }

  get warnings(): readonly IndexWarning[] {
    return [...this.warningList].sort((left, right) => left.path.localeCompare(right.path));
  }

  get graph(): Graph {
    return this.graphValue;
  }

  getConcept(conceptPath: string): Concept | undefined {
    return this.conceptMap.get(normalizeConceptPath(conceptPath));
  }

  getUpdateState(conceptPath: string): UpdateState | undefined {
    const concept = this.getConcept(conceptPath);
    if (!concept) {
      return undefined;
    }

    return deriveUpdateState(concept.frontmatter, this.now(), this.needsReviewDays);
  }

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const limit = options.limit ?? 10;
    if (!Number.isSafeInteger(limit) || limit < 0) {
      throw new Error("Search limit must be a non-negative integer.");
    }
    if (limit === 0 || query.trim().length === 0) {
      return [];
    }

    const results = this.searchIndex.search(query, {
      boost: { title: 5, description: 3, tags: 2 },
      filter: (result) => {
        const conceptPath = String(result.id);
        const concept = this.conceptMap.get(conceptPath);
        if (!concept) {
          throw new Error(`MiniSearch returned an unknown concept path: ${conceptPath}`);
        }
        return (
          (options.type === undefined || concept.type === options.type) &&
          (options.tag === undefined || concept.tags.includes(options.tag))
        );
      },
    });

    return results.slice(0, limit).map((result) => {
      const concept = this.conceptMap.get(String(result.id));
      if (!concept) {
        throw new Error(`MiniSearch returned an unknown concept path: ${String(result.id)}`);
      }
      return {
        path: concept.path,
        title: concept.title,
        description: concept.description,
        type: concept.type,
        tags: [...concept.tags],
        score: result.score,
      };
    });
  }

  sweepChanged(): Promise<SweepChangedReport> {
    return this.runLifecycle(() => this.performSweepChanged());
  }

  private async performSweepChanged(): Promise<SweepChangedReport> {
    const conceptFiles = await findConceptFiles(this.wikiPath);
    const currentSnapshots = conceptFiles.snapshots;
    const changedPaths = [...currentSnapshots.keys()]
      .filter(
        (filePath) =>
          !this.fileSnapshots.has(filePath) ||
          !sameSnapshot(this.fileSnapshots.get(filePath), currentSnapshots.get(filePath)),
      )
      .sort();
    const removedPaths = [...this.fileSnapshots.keys()]
      .filter((filePath) => !currentSnapshots.has(filePath))
      .sort();
    const updates = await Promise.all(
      changedPaths.map(async (filePath) => {
        const expectedSnapshot = currentSnapshots.get(filePath);
        if (!expectedSnapshot) {
          throw new Error(`Missing file metadata during index sweep: ${filePath}`);
        }
        const read = await readWikiFile(this.wikiPath, filePath, expectedSnapshot);
        return {
          filePath,
          parsed: "warning" in read ? { warning: read.warning } : parseConcept(filePath, read.source),
          snapshot: "warning" in read ? undefined : read.snapshot,
        };
      }),
    );

    const currentBundleIndex = await readBundleIndexState(this.wikiPath);
    const bundleIndexChanged = !sameSnapshot(
      this.bundleIndexSnapshot,
      currentBundleIndex.snapshot,
    );

    for (const filePath of removedPaths) {
      const conceptPath = normalizeConceptPath(filePath);
      const removedConcept = this.conceptMap.get(conceptPath);
      if (removedConcept) {
        this.searchIndex.discard(conceptPath);
        this.conceptMap.delete(conceptPath);
      }
      this.removeWarning(filePath);
    }

    for (const { filePath, parsed, snapshot } of updates) {
      if (snapshot) {
        currentSnapshots.set(filePath, snapshot);
      } else {
        currentSnapshots.delete(filePath);
      }
      const conceptPath = normalizeConceptPath(filePath);
      const previousConcept = this.conceptMap.get(conceptPath);
      if (previousConcept) {
        this.searchIndex.discard(conceptPath);
        this.conceptMap.delete(conceptPath);
      }

      if (!("concept" in parsed)) {
        this.replaceWarning(filePath, parsed.warning);
      } else {
        this.conceptMap.set(parsed.concept.path, parsed.concept);
        this.searchIndex.add(searchDocument(parsed.concept));
        this.replaceWarning(filePath, parsed.warning);
      }
    }

    for (const filePath of this.scanWarningPaths) {
      this.removeWarning(filePath);
    }
    for (const warning of conceptFiles.warnings) {
      this.replaceWarning(warning.path, warning);
    }
    this.scanWarningPaths = new Set(
      conceptFiles.warnings.map(({ path: filePath }) => filePath),
    );

    if (bundleIndexChanged) {
      this.replaceWarning("index.md", currentBundleIndex.warning);
      this.bundleIndexSnapshot = currentBundleIndex.snapshot;
    }

    this.fileSnapshots = currentSnapshots;
    if (changedPaths.length > 0 || removedPaths.length > 0) {
      this.graphValue = buildGraph([...this.conceptMap.values()]);
    }

    return {
      scanned: currentSnapshots.size,
      reparsed: changedPaths,
      removed: removedPaths,
      warnings: this.warnings.map((warning) => ({ ...warning })),
    };
  }

  reindex(): Promise<ReindexReport> {
    return this.runLifecycle(() => this.performReindex());
  }

  private async performReindex(): Promise<ReindexReport> {
    const state = await loadWikiState(this.wikiPath);
    this.conceptMap.clear();
    for (const [conceptPath, concept] of state.concepts) {
      this.conceptMap.set(conceptPath, concept);
    }
    this.warningList.splice(0, this.warningList.length, ...state.warnings);
    this.fileSnapshots = state.snapshots;
    this.scanWarningPaths = new Set(state.scanWarnings.map(({ path: filePath }) => filePath));
    this.bundleIndexSnapshot = state.bundleIndex.snapshot;
    this.graphValue = buildGraph([...this.conceptMap.values()]);
    this.searchIndex = buildSearchIndex([...this.conceptMap.values()]);

    return {
      indexed: this.conceptMap.size,
      skipped: state.skipped.map((warning) => ({ ...warning })),
      warnings: this.warnings.map((warning) => ({ ...warning })),
    };
  }

  private runLifecycle<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.lifecycleTail.then(operation);
    this.lifecycleTail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private replaceWarning(filePath: string, warning?: IndexWarning): void {
    this.removeWarning(filePath);
    if (warning) {
      this.warningList.push(warning);
    }
  }

  private removeWarning(filePath: string): void {
    const warningIndex = this.warningList.findIndex((warning) => warning.path === filePath);
    if (warningIndex !== -1) {
      this.warningList.splice(warningIndex, 1);
    }
  }
}

export async function buildIndex(
  wikiPath: string,
  options: BuildIndexOptions = {},
): Promise<WikiIndexer> {
  const needsReviewDays = options.needsReviewDays ?? 7;
  if (!Number.isInteger(needsReviewDays) || needsReviewDays < 0) {
    throw new Error("needsReviewDays must be a non-negative integer.");
  }

  const now = options.now ?? (() => new Date());
  const resolvedWikiPath = path.resolve(wikiPath);
  await assertWikiDirectory(resolvedWikiPath);

  const canonicalWikiPath = await realpath(resolvedWikiPath);
  const state = await loadWikiState(canonicalWikiPath);
  return new InMemoryWikiIndex(
    canonicalWikiPath,
    needsReviewDays,
    now,
    state,
  );
}

async function assertWikiDirectory(wikiPath: string): Promise<void> {
  try {
    const wikiStat = await stat(wikiPath);
    if (!wikiStat.isDirectory()) {
      throw new Error(`Wiki path is not a directory: ${wikiPath}`);
    }
  } catch (error) {
    if (isNodeErrorCode(error, "ENOENT")) {
      throw new Error(`Wiki directory does not exist: ${wikiPath}`, { cause: error });
    }
    throw error;
  }
}

async function readBundleIndexState(wikiPath: string): Promise<BundleIndexState> {
  const indexPath = path.join(wikiPath, "index.md");
  let indexStat: Stats;
  try {
    indexStat = await lstat(indexPath);
  } catch (error) {
    if (isNodeErrorCode(error, "ENOENT")) {
      return {};
    }
    if (isNodeErrorCode(error, ["EACCES", "EPERM"])) {
      return {
        warning: {
          path: "index.md",
          reason: "Bundle-root index.md could not be inspected.",
        },
      };
    }
    throw error;
  }

  const snapshot = snapshotFromStat(indexStat);
  if (indexStat.isSymbolicLink()) {
    return {
      snapshot,
      warning: {
        path: "index.md",
        reason: "Bundle-root index.md is a symbolic link and was not read.",
      },
    };
  }
  if (!indexStat.isFile()) {
    return {
      snapshot,
      warning: {
        path: "index.md",
        reason: "Bundle-root index.md is not a regular file and was not read.",
      },
    };
  }
  if (indexStat.nlink !== 1) {
    return {
      snapshot,
      warning: {
        path: "index.md",
        reason: "Bundle-root index.md has multiple hard links and was not read.",
      },
    };
  }

  const read = await readWikiFile(wikiPath, "index.md", snapshot);
  if ("warning" in read) {
    return { snapshot: read.snapshot, warning: read.warning };
  }

  let frontmatter: FrontmatterValue;
  try {
    frontmatter = normalizeYamlValue(parseFrontmatter(read.source).data);
  } catch {
    return {
      snapshot: read.snapshot,
      warning: {
        path: "index.md",
        reason: "Invalid YAML frontmatter in bundle-root index.md.",
      },
    };
  }

  if (!isRecord(frontmatter) || !Object.hasOwn(frontmatter, "okf_version")) {
    return { snapshot: read.snapshot };
  }

  const rawVersion = frontmatter.okf_version;
  const version =
    typeof rawVersion === "string" || typeof rawVersion === "number"
      ? String(rawVersion).trim()
      : "";
  const majorMatch = /^v?(\d+)(?:\.|$)/i.exec(version);
  const major = majorMatch ? Number(majorMatch[1]) : undefined;
  if (major === 0) {
    return { snapshot: read.snapshot };
  }

  return {
    snapshot: read.snapshot,
    warning: {
      path: "index.md",
      reason:
        major === undefined
          ? "Invalid OKF version in bundle-root index.md."
          : `Unsupported OKF major version ${major} in bundle-root index.md; only major version 0 is supported.`,
    },
  };
}

async function findConceptFiles(wikiPath: string): Promise<{
  snapshots: Map<string, FileSnapshot>;
  warnings: IndexWarning[];
}> {
  const snapshots = new Map<string, FileSnapshot>();
  const warnings: IndexWarning[] = [];

  async function visit(relativeDirectory: string): Promise<void> {
    const requestedDirectory = relativeDirectory
      ? path.join(wikiPath, ...relativeDirectory.split("/"))
      : wikiPath;
    try {
      const directoryStat = await lstat(requestedDirectory);
      if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) {
        warnings.push({
          path: relativeDirectory || ".",
          reason: "Directory changed type during indexing and was not traversed.",
        });
        return;
      }
    } catch (error) {
      if (!isNodeErrorCode(error, ["ENOENT", "ENOTDIR", "EACCES", "EPERM", "ELOOP"])) {
        throw error;
      }
      warnings.push({
        path: relativeDirectory || ".",
        reason: "Directory was unavailable during indexing.",
      });
      return;
    }

    let entries;
    try {
      entries = await readdir(requestedDirectory, { withFileTypes: true });
    } catch (error) {
      if (!isNodeErrorCode(error, ["ENOENT", "ENOTDIR", "EACCES", "EPERM", "ELOOP"])) {
        throw error;
      }
      warnings.push({
        path: relativeDirectory || ".",
        reason: "Directory was unavailable during indexing.",
      });
      return;
    }
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const relativePath = relativeDirectory
        ? `${relativeDirectory}/${entry.name}`
        : entry.name;

      if (entry.isDirectory()) {
        await visit(relativePath);
      } else if (entry.isSymbolicLink()) {
        if (!reservedFiles.has(entry.name)) {
          warnings.push({
            path: relativePath,
            reason: "Symbolic link was not followed or indexed.",
          });
        }
      } else if (entry.isFile() && entry.name.endsWith(".md") && !reservedFiles.has(entry.name)) {
        const filePath = path.join(requestedDirectory, entry.name);
        try {
          const fileStat = await lstat(filePath);
          if (fileStat.isSymbolicLink() || !fileStat.isFile()) {
            warnings.push({
              path: relativePath,
              reason: "File changed type during indexing and was not indexed.",
            });
          } else if (fileStat.nlink !== 1) {
            warnings.push({
              path: relativePath,
              reason: "File has multiple hard links and was not indexed.",
            });
          } else {
            snapshots.set(relativePath, snapshotFromStat(fileStat));
          }
        } catch (error) {
          if (!isNodeErrorCode(error, ["ENOENT", "ENOTDIR", "EACCES", "EPERM"])) {
            throw error;
          }
          warnings.push({
            path: relativePath,
            reason: "File was unavailable during indexing.",
          });
        }
      }
    }
  }

  await visit("");
  return { snapshots, warnings };
}

async function loadWikiState(wikiPath: string): Promise<WikiState> {
  const conceptFiles = await findConceptFiles(wikiPath);
  const { snapshots } = conceptFiles;
  const concepts = new Map<string, Concept>();
  const skipped = [...conceptFiles.warnings];
  const conceptWarnings: IndexWarning[] = [];
  const bundleIndex = await readBundleIndexState(wikiPath);

  for (const filePath of snapshots.keys()) {
    const snapshot = snapshots.get(filePath);
    if (!snapshot) {
      throw new Error(`Missing file metadata during index build: ${filePath}`);
    }
    const read = await readWikiFile(wikiPath, filePath, snapshot);
    if ("warning" in read) {
      skipped.push(read.warning);
      snapshots.delete(filePath);
      continue;
    }

    snapshots.set(filePath, read.snapshot);
    const parsed = parseConcept(filePath, read.source);
    if (!("concept" in parsed)) {
      skipped.push(parsed.warning);
    } else {
      concepts.set(parsed.concept.path, parsed.concept);
      if (parsed.warning) {
        conceptWarnings.push(parsed.warning);
      }
    }
  }

  const warnings = [...skipped, ...conceptWarnings];
  if (bundleIndex.warning) {
    warnings.push(bundleIndex.warning);
  }

  return {
    concepts,
    snapshots,
    scanWarnings: conceptFiles.warnings,
    bundleIndex,
    skipped,
    warnings,
  };
}

function snapshotFromStat(fileStat: Stats): FileSnapshot {
  return {
    mtimeMs: fileStat.mtimeMs,
    size: fileStat.size,
    symbolicLink: fileStat.isSymbolicLink(),
    dev: fileStat.dev,
    ino: fileStat.ino,
    linkCount: fileStat.nlink,
  };
}

async function readWikiFile(
  wikiPath: string,
  relativeFilePath: string,
  expectedSnapshot: FileSnapshot,
): Promise<WikiFileReadResult> {
  const absolutePath = path.resolve(wikiPath, ...relativeFilePath.split("/"));
  const warning = (
    reason: string,
    snapshot?: FileSnapshot,
  ): WikiFileReadResult => ({
    snapshot,
    warning: { path: relativeFilePath, reason },
  });
  let handle: Awaited<ReturnType<typeof open>> | undefined;

  try {
    if (!isPathWithin(wikiPath, absolutePath)) {
      return warning("File path resolves outside the wiki root and was not read.");
    }

    const initialPathStat = await lstat(absolutePath);
    const initialSnapshot = snapshotFromStat(initialPathStat);
    if (
      initialPathStat.isSymbolicLink() ||
      !initialPathStat.isFile()
    ) {
      return warning("File changed type during indexing and was not read.", initialSnapshot);
    }
    if (!hasSingleHardLink(initialSnapshot)) {
      return warning("File has multiple hard links and was not read.", initialSnapshot);
    }
    if (!sameFileIdentity(expectedSnapshot, initialSnapshot)) {
      return warning("File changed identity during indexing and was not read.", initialSnapshot);
    }

    handle = await open(absolutePath, readOnlyNoFollowFlags);
    const openedStat = await handle.stat();
    const openedSnapshot = snapshotFromStat(openedStat);
    if (!openedStat.isFile()) {
      return warning("Opened file is not a regular file and was not read.", openedSnapshot);
    }
    if (!hasSingleHardLink(openedSnapshot)) {
      return warning("Opened file has multiple hard links and was not read.", openedSnapshot);
    }
    if (!sameFileIdentity(expectedSnapshot, openedSnapshot) || !hasStableFileIdentity(openedSnapshot)) {
      return warning("Opened file identity could not be verified; file was not read.", openedSnapshot);
    }

    const source = await handle.readFile({ encoding: "utf8" });
    const finalStat = await handle.stat();
    const finalSnapshot = snapshotFromStat(finalStat);
    if (
      !finalStat.isFile() ||
      !hasSingleHardLink(finalSnapshot) ||
      !sameFileIdentity(openedSnapshot, finalSnapshot)
    ) {
      return warning("File changed while reading and was not indexed.", finalSnapshot);
    }

    return { source, snapshot: finalSnapshot };
  } catch (error) {
    if (isNodeErrorCode(error, ["ENOENT", "ENOTDIR", "ELOOP", "EACCES", "EPERM", "EISDIR"])) {
      return warning("File changed or became unavailable during indexing.");
    }
    throw error;
  } finally {
    await handle?.close();
  }
}

function hasStableFileIdentity(snapshot: FileSnapshot): boolean {
  return Number.isFinite(snapshot.dev) && Number.isFinite(snapshot.ino) && snapshot.ino !== 0;
}

function hasSingleHardLink(snapshot: FileSnapshot): boolean {
  return snapshot.linkCount === 1;
}

function sameFileIdentity(left: FileSnapshot, right: FileSnapshot): boolean {
  return (
    hasStableFileIdentity(left) &&
    hasStableFileIdentity(right) &&
    left.dev === right.dev &&
    left.ino === right.ino
  );
}

function isPathWithin(root: string, candidate: string): boolean {
  const relativePath = path.relative(root, candidate);
  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

function sameSnapshot(
  left: FileSnapshot | undefined,
  right: FileSnapshot | undefined,
): boolean {
  return (
    left === right ||
    (left !== undefined &&
      right !== undefined &&
      left.mtimeMs === right.mtimeMs &&
      left.size === right.size &&
      left.symbolicLink === right.symbolicLink &&
      left.dev === right.dev &&
      left.ino === right.ino &&
      left.linkCount === right.linkCount)
  );
}

function parseConcept(
  relativeFilePath: string,
  source: string,
): ConceptParseResult {
  let parsed: ParsedFrontmatter;
  try {
    parsed = parseFrontmatter(source);
  } catch {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Invalid YAML frontmatter.",
      },
    };
  }

  let frontmatter: FrontmatterValue;
  try {
    frontmatter = normalizeYamlValue(parsed.data);
  } catch {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Invalid YAML frontmatter.",
      },
    };
  }

  if (!isRecord(frontmatter)) {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Frontmatter must be a YAML mapping.",
      },
    };
  }

  const missingFields = mandatoryFields.filter(
    (field) => !Object.hasOwn(frontmatter, field) || frontmatter[field] === null,
  );
  if (missingFields.length > 0) {
    return {
      warning: {
        path: relativeFilePath,
        reason: `Missing mandatory field${missingFields.length === 1 ? "" : "s"}: ${missingFields.join(", ")}.`,
      },
    };
  }

  const type = frontmatter.type;
  const title = frontmatter.title;
  const description = frontmatter.description;
  const generated = frontmatter.generated;
  const sources = frontmatter.sources;

  if (!isNonEmptyString(type) || !isNonEmptyString(title) || !isNonEmptyString(description)) {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Mandatory fields type, title, and description must be non-empty strings.",
      },
    };
  }

  if (!isRecord(generated) || !isNonEmptyString(generated.by)) {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Mandatory field generated must include a non-empty by value and a valid at timestamp.",
      },
    };
  }

  const generatedAt = parseTimestamp(generated.at);
  if (!generatedAt) {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Mandatory field generated must include a non-empty by value and a valid at timestamp.",
      },
    };
  }
  if (!isFrontmatterArray(sources)) {
    return {
      warning: {
        path: relativeFilePath,
        reason: "Mandatory field sources must be a YAML list.",
      },
    };
  }

  const tagsValue = frontmatter.tags;
  const tags = isFrontmatterArray(tagsValue)
    ? tagsValue.filter((tag): tag is string => typeof tag === "string")
    : [];
  const metadataWarning = optionalUpdateMetadataWarning(relativeFilePath, frontmatter);

  return {
    concept: {
      path: relativeFilePath.replace(/\.md$/i, ""),
      type,
      title,
      description,
      tags,
      generated: {
        by: generated.by,
        at: generatedAt,
      },
      sources,
      frontmatter,
      body: parsed.content,
    },
    warning: metadataWarning,
  };
}

function parseFrontmatter(source: string): ParsedFrontmatter {
  const content = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
  if (!content.startsWith("---") || content[3] === "-") {
    return { data: {}, content };
  }

  const rawFrontmatter = content.slice(3);
  const firstLineEnd = rawFrontmatter.search(/\r?\n/);
  const language =
    firstLineEnd === -1 ? rawFrontmatter : rawFrontmatter.slice(0, firstLineEnd);
  const normalizedLanguage = language.trim().toLowerCase();
  if (normalizedLanguage !== "" && normalizedLanguage !== "yaml" && normalizedLanguage !== "yml") {
    throw new Error("Only YAML frontmatter is supported.");
  }
  const yamlContent = normalizedLanguage === "" ? rawFrontmatter : rawFrontmatter.slice(language.length);
  const closingDelimiter = yamlContent.indexOf("\n---");
  const yamlSource =
    closingDelimiter === -1 ? yamlContent : yamlContent.slice(0, closingDelimiter);
  let body =
    closingDelimiter === -1 ? "" : yamlContent.slice(closingDelimiter + "\n---".length);
  if (body.startsWith("\r")) {
    body = body.slice(1);
  }
  if (body.startsWith("\n")) {
    body = body.slice(1);
  }
  const yamlBlock = yamlSource.trim();

  return {
    data: yamlBlock === "" ? {} : parseYamlFrontmatter(yamlBlock),
    content: body,
  };
}

function parseYamlFrontmatter(source: string): object {
  const value = jsYaml.safeLoad(source, { schema: jsYaml.JSON_SCHEMA });
  if (typeof value !== "object" || value === null) {
    throw new Error("YAML frontmatter must be a mapping.");
  }
  return value;
}

function normalizeYamlValue(value: unknown): FrontmatterValue {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error("YAML contains an invalid date.");
    }
    return value.toISOString();
  }

  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeYamlValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeYamlValue(item)]),
    );
  }

  throw new Error(`Unsupported YAML value: ${String(value)}.`);
}

function isRecord(value: FrontmatterValue): value is Record<string, FrontmatterValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFrontmatterArray(value: FrontmatterValue): value is FrontmatterValue[] {
  return Array.isArray(value);
}

function isNonEmptyString(value: FrontmatterValue | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseTimestamp(value: FrontmatterValue | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+-](\d{2}):(\d{2}))$/i.exec(
      value.trim(),
    );
  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const rawOffsetHour = match[9];
  const rawOffsetMinute = match[10];
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    (rawOffsetHour !== undefined && Number(rawOffsetHour) > 23) ||
    (rawOffsetMinute !== undefined && Number(rawOffsetMinute) > 59)
  ) {
    return undefined;
  }

  const localDate = new Date(0);
  localDate.setUTCFullYear(year, month - 1, day);
  localDate.setUTCHours(hour, minute, second, 0);
  if (
    localDate.getUTCFullYear() !== year ||
    localDate.getUTCMonth() !== month - 1 ||
    localDate.getUTCDate() !== day
  ) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function isValidVerificationEntry(
  value: FrontmatterValue,
): value is Record<string, FrontmatterValue> {
  if (!isRecord(value) || !isNonEmptyString(value.by)) {
    return false;
  }
  if (value.by.startsWith("human:") && value.by.slice("human:".length).trim().length === 0) {
    return false;
  }
  return parseTimestamp(value.at) !== undefined;
}

function optionalUpdateMetadataWarning(
  relativeFilePath: string,
  frontmatter: Record<string, FrontmatterValue>,
): IndexWarning | undefined {
  const invalidFields: string[] = [];
  if (Object.hasOwn(frontmatter, "verified")) {
    const verified = frontmatter.verified;
    if (
      !isFrontmatterArray(verified) ||
      verified.some((entry) => !isValidVerificationEntry(entry))
    ) {
      invalidFields.push("verified");
    }
  }
  if (
    Object.hasOwn(frontmatter, "stale_after") &&
    parseTimestamp(frontmatter.stale_after) === undefined
  ) {
    invalidFields.push("stale_after");
  }
  if (invalidFields.length === 0) {
    return undefined;
  }
  return {
    path: relativeFilePath,
    reason: `Invalid optional field${invalidFields.length === 1 ? "" : "s"} ${invalidFields.join(", ")}; invalid values were ignored when deriving update state.`,
  };
}

function deriveUpdateState(
  frontmatter: Record<string, FrontmatterValue>,
  now: Date,
  needsReviewDays: number,
): UpdateState {
  if (Number.isNaN(now.getTime())) {
    throw new Error("The index clock returned an invalid date.");
  }

  const verifiedValue = frontmatter.verified;
  const verificationEvents = isFrontmatterArray(verifiedValue)
    ? verifiedValue.filter(isValidVerificationEntry)
    : [];
  const hasHumanVerifier = verificationEvents.some(
    (event) => isNonEmptyString(event.by) && event.by.startsWith("human:"),
  );
  const hasVerifier = verificationEvents.length > 0;
  const trustTier: TrustTier = hasHumanVerifier
    ? "human-reviewed"
    : hasVerifier
      ? "machine-confirmed"
      : "unverified";

  const verifiedTimestamps = verificationEvents
    .map((event) => parseTimestamp(event.at))
    .filter((timestamp): timestamp is string => timestamp !== undefined)
    .sort((left, right) => Date.parse(right) - Date.parse(left));
  const lastVerifiedAt = verifiedTimestamps[0] ?? null;
  const generatedAt = isRecord(frontmatter.generated)
    ? parseTimestamp(frontmatter.generated.at)
    : undefined;
  const dateForReview = lastVerifiedAt ?? generatedAt ?? null;
  const daysSinceVerified =
    dateForReview === null
      ? null
      : Math.max(0, Math.floor((now.getTime() - Date.parse(dateForReview)) / millisecondsPerDay));
  const staleAfter =
    Object.hasOwn(frontmatter, "stale_after")
      ? parseTimestamp(frontmatter.stale_after)
      : undefined;

  return {
    stale: staleAfter !== undefined && now.getTime() >= Date.parse(staleAfter),
    stale_after: staleAfter ?? null,
    trust_tier: trustTier,
    last_verified_at: lastVerifiedAt,
    days_since_verified: daysSinceVerified,
    needs_review: daysSinceVerified !== null && daysSinceVerified > needsReviewDays,
  };
}

function buildGraph(concepts: Concept[]): Graph {
  const orderedConcepts = [...concepts].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
  const conceptPaths = new Set(orderedConcepts.map((concept) => concept.path));
  const nodes = orderedConcepts.map((concept) => ({
    id: concept.path,
    title: concept.title,
    type: concept.type,
    tags: [...concept.tags],
  }));
  const linkEdges = new Map<string, GraphEdge>();

  for (const concept of orderedConcepts) {
    const sourceFilePath = `${concept.path}.md`;
    for (const target of extractMarkdownTargets(concept.body, sourceFilePath)) {
      const key = JSON.stringify([concept.path, target]);
      if (!linkEdges.has(key)) {
        linkEdges.set(key, {
          kind: "link",
          source: concept.path,
          target,
          dangling: !conceptPaths.has(target),
        });
      }
    }
  }

  const sharedTagEdges: GraphEdge[] = [];
  for (let leftIndex = 0; leftIndex < orderedConcepts.length; leftIndex += 1) {
    const left = orderedConcepts[leftIndex];
    for (let rightIndex = leftIndex + 1; rightIndex < orderedConcepts.length; rightIndex += 1) {
      const right = orderedConcepts[rightIndex];
      const sharedTags = [...new Set(left.tags.filter((tag) => right.tags.includes(tag)))].sort();
      if (sharedTags.length > 0) {
        sharedTagEdges.push({
          kind: "shared-tag",
          source: left.path,
          target: right.path,
          tags: sharedTags,
        });
      }
    }
  }

  return {
    nodes,
    edges: [...linkEdges.values(), ...sharedTagEdges],
  };
}

function buildSearchIndex(concepts: Concept[]): MiniSearch<SearchDocument> {
  const index = new MiniSearch<SearchDocument>({
    idField: "id",
    fields: ["title", "description", "tags", "body"],
    stringifyField: (fieldValue) =>
      Array.isArray(fieldValue) ? fieldValue.join(" ") : String(fieldValue),
  });
  index.addAll(concepts.map(searchDocument));
  return index;
}

function searchDocument(concept: Concept): SearchDocument {
  return {
    id: concept.path,
    title: concept.title,
    description: concept.description,
    tags: [...concept.tags],
    body: concept.body,
  };
}

function extractMarkdownTargets(body: string, sourceFilePath: string): string[] {
  const links: string[] = [];
  const markdownLink = /(?<!!)\[[^\]]*\]\(\s*(?:<([^>\s]+)>|([^\s)]+))(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

  for (const match of body.matchAll(markdownLink)) {
    const href = match[1] ?? match[2];
    if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) {
      continue;
    }

    const pathPart = href.split(/[?#]/, 1)[0];
    if (!pathPart.endsWith(".md")) {
      continue;
    }

    let decodedPath = pathPart;
    try {
      decodedPath = decodeURIComponent(pathPart);
    } catch (error) {
      if (!(error instanceof URIError)) {
        throw error;
      }
      decodedPath = pathPart;
    }

    const targetFilePath = decodedPath.startsWith("/")
      ? decodedPath.slice(1)
      : path.posix.join(path.posix.dirname(sourceFilePath), decodedPath);
    links.push(path.posix.normalize(targetFilePath).replace(/\.md$/, ""));
  }

  return links;
}

function normalizeConceptPath(conceptPath: string): string {
  return conceptPath.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\.md$/i, "");
}

function isNodeErrorCode(error: unknown, code: string | readonly string[]): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (Array.isArray(code) ? code.includes(String(error.code)) : error.code === code)
  );
}
