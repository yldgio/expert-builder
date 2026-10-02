import assert from "node:assert/strict";
import { link, mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildIndex } from "../src/indexer.ts";

const fixturePath = fileURLToPath(new URL("./fixtures/wiki/", import.meta.url));
const sampleWikiPath = fileURLToPath(
  new URL("../../../samples/azure-ai-search-rag-expert/wiki/", import.meta.url),
);
const now = () => new Date("2026-10-01T12:00:00.000Z");

async function createTemporaryWiki(files) {
  const wikiPath = await mkdtemp(path.join(os.tmpdir(), "wiki-mcp-test-"));

  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(wikiPath, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents);
  }

  return wikiPath;
}

test("parses OKF concept frontmatter and excludes reserved catalog files", async () => {
  const index = await buildIndex(fixturePath, { now });

  const conceptPaths = index.concepts.map(({ path: conceptPath }) => conceptPath);
  assert.deepEqual(conceptPaths, [
    "retrieval/needs-review",
    "retrieval/stale",
    "retrieval/unverified",
  ]);

  const concept = index.getConcept("retrieval/stale");
  assert.ok(concept);
  assert.equal(concept.type, "Reference");
  assert.equal(concept.title, "Stale retrieval");
  assert.equal(concept.description, "A frontmatter parsing fixture.");
  assert.deepEqual(concept.tags, ["retrieval", "shared"]);
  assert.equal(concept.generated.by, "test/v1");
  assert.equal(concept.generated.at, "2026-10-01T10:00:00.000Z");
  assert.equal(concept.sources[0].id, "parser-source");
  assert.equal(
    concept.body.replace(/\r\n/g, "\n").trim(),
    "# Stale retrieval\nSee [needs review](/retrieval/needs-review.md#freshness). The citation [^parser-source] is not a link.",
  );
});

test("indexes all eight seeded concepts in the sample wiki without warnings", async () => {
  const index = await buildIndex(sampleWikiPath, { now });

  assert.deepEqual(
    index.concepts.map(({ path: conceptPath }) => conceptPath),
    [
      "evaluation/evaluation-monitoring-and-tuning",
      "foundations/glossary",
      "foundations/rag-reference-architecture",
      "ingestion/chunking-and-embeddings",
      "ingestion/data-ingestion-and-indexing",
      "retrieval/agentic-retrieval",
      "retrieval/vector-hybrid-semantic-ranking",
      "security/security-and-data-access",
    ],
  );
  assert.deepEqual(index.warnings, []);
});

test("derives stale, unverified, and needs-review state", async () => {
  const index = await buildIndex(fixturePath, { now });

  assert.deepEqual(index.getUpdateState("retrieval/stale"), {
    stale: true,
    stale_after: "2026-09-01T00:00:00.000Z",
    trust_tier: "machine-confirmed",
    last_verified_at: "2026-10-01T11:00:00.000Z",
    days_since_verified: 0,
    needs_review: false,
  });

  assert.deepEqual(index.getUpdateState("retrieval/unverified"), {
    stale: false,
    stale_after: null,
    trust_tier: "unverified",
    last_verified_at: null,
    days_since_verified: 0,
    needs_review: false,
  });

  assert.deepEqual(index.getUpdateState("retrieval/needs-review"), {
    stale: false,
    stale_after: "2027-01-01T00:00:00.000Z",
    trust_tier: "human-reviewed",
    last_verified_at: "2026-09-20T12:00:00.000Z",
    days_since_verified: 11,
    needs_review: true,
  });

  const longerThresholdIndex = await buildIndex(fixturePath, {
    now,
    needsReviewDays: 11,
  });
  assert.equal(
    longerThresholdIndex.getUpdateState("retrieval/needs-review")?.needs_review,
    false,
  );
});

test("indexes bundle-root cross-links and shared-tag graph edges", async () => {
  const index = await buildIndex(fixturePath, { now });
  const graph = index.graph;

  assert.ok(graph.nodes.some((node) => node.id === "retrieval/needs-review"));
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.kind === "link" &&
        edge.source === "retrieval/stale" &&
        edge.target === "retrieval/needs-review" &&
        !edge.dangling,
    ),
  );
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.kind === "link" &&
        edge.source === "retrieval/unverified" &&
        edge.target === "retrieval/stale" &&
        !edge.dangling,
    ),
  );
  assert.ok(
    graph.edges.some(
      (edge) =>
        edge.kind === "shared-tag" &&
        edge.tags.includes("shared") &&
        [edge.source, edge.target].includes("retrieval/stale") &&
        [edge.source, edge.target].includes("retrieval/needs-review"),
    ),
  );
  assert.equal(
    graph.edges.some(
      (edge) => edge.kind === "link" && edge.target === "retrieval/parser-source",
    ),
    false,
  );
});

test("resolves links relative to the source concept", async () => {
  const wikiPath = await createTemporaryWiki({
    "retrieval/stale.md": `---
type: Reference
title: Stale concept
description: Relative-link target.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`,
    "retrieval/sections/related.md": `---
type: Reference
title: Related concept
description: Relative-link source.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
See [stale](../stale.md).
`,
  });

  try {
    const index = await buildIndex(wikiPath, { now });

    assert.ok(
      index.graph.edges.some(
        (edge) =>
          edge.kind === "link" &&
          edge.source === "retrieval/sections/related" &&
          edge.target === "retrieval/stale" &&
          !edge.dangling,
      ),
    );
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("collects warnings for malformed concept files and excludes them", async () => {
  const index = await buildIndex(fixturePath, { now });
  const warningByPath = new Map(index.warnings.map((warning) => [warning.path, warning.reason]));

  assert.equal(index.warnings.length, 1);
  assert.match(warningByPath.get("retrieval/malformed.md"), /Invalid YAML frontmatter/);
  assert.equal(index.getConcept("retrieval/malformed"), undefined);
});

test("warns for malformed YAML and missing required concept fields", async () => {
  const wikiPath = await createTemporaryWiki({
    "retrieval/bad-yaml.md": `---
type: Reference
title: Malformed YAML
description: [broken
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`,
    "retrieval/missing-sources.md": `---
type: Reference
title: Missing sources
description: Required sources field is absent.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
---
`,
  });

  try {
    const index = await buildIndex(wikiPath, { now });
    const warningByPath = new Map(index.warnings.map(({ path: filePath, reason }) => [filePath, reason]));

    assert.match(warningByPath.get("retrieval/bad-yaml.md"), /Invalid YAML frontmatter/);
    assert.match(warningByPath.get("retrieval/missing-sources.md"), /sources/);
    assert.equal(index.concepts.length, 0);
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("invalid optional verification metadata cannot promote trust or hide invalid freshness", async () => {
  const wikiPath = await createTemporaryWiki({
    "retrieval/invalid-update-metadata.md": `---
type: Reference
title: Invalid update metadata
description: Invalid optional update metadata must not grant trust.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
verified:
  - { by: test/v1, at: 2026-09-01T00:00:00Z }
  - { by: "human:spoof", at: "2026-02-30T00:00:00Z" }
  - { by: "human:date-only", at: "2026-10-01" }
stale_after: 2026-10-02
sources: []
---
# Invalid update metadata
`,
  });

  try {
    const index = await buildIndex(wikiPath, { now });
    const concept = index.getConcept("retrieval/invalid-update-metadata");
    const warning = index.warnings.find(
      ({ path: warningPath }) => warningPath === "retrieval/invalid-update-metadata.md",
    );

    assert.ok(concept);
    assert.ok(warning);
    assert.match(warning.reason, /verified, stale_after/);
    assert.deepEqual(index.getUpdateState("retrieval/invalid-update-metadata"), {
      stale: false,
      stale_after: null,
      trust_tier: "machine-confirmed",
      last_verified_at: "2026-09-01T00:00:00.000Z",
      days_since_verified: 30,
      needs_review: true,
    });
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("rejects non-YAML frontmatter without executing JavaScript", async () => {
  delete globalThis.__wikiMcpUnsafeFrontmatter;
  const index = await buildIndex(fixturePath, { now });

  assert.equal(globalThis.__wikiMcpUnsafeFrontmatter, undefined);
  assert.ok(index.warnings.some(({ path: warningPath }) => warningPath === "retrieval/malformed.md"));
});

test("warns when the bundle-root index declares an unsupported OKF major version", async () => {
  const wikiPath = await createTemporaryWiki({
    "index.md": `---
okf_version: "1.0"
---
# Unsupported version
`,
  });

  try {
    const index = await buildIndex(wikiPath, { now });

    assert.equal(index.concepts.length, 0);
    assert.equal(index.warnings.length, 1);
    assert.equal(index.warnings[0].path, "index.md");
    assert.match(index.warnings[0].reason, /unsupported OKF major version 1/i);
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("does not read symlinked index or concept files", async (t) => {
  const temporaryPath = await mkdtemp(path.join(os.tmpdir(), "wiki-mcp-symlink-"));
  const wikiPath = path.join(temporaryPath, "wiki");
  const externalPath = path.join(temporaryPath, "private.md");
  const externalConceptPath = path.join(temporaryPath, "external-concept.md");
  const externalDirectoryPath = path.join(temporaryPath, "private-directory");
  await mkdir(wikiPath);
  await mkdir(path.join(wikiPath, "retrieval"));
  await mkdir(externalDirectoryPath);

  try {
    await writeFile(
      externalPath,
      `---
description: PRIVATE_CONTENT_SHOULD_NOT_APPEAR: [malformed
---
`,
    );
    await writeFile(
      externalConceptPath,
      `---
type: Reference
title: EXTERNAL_CONCEPT_SHOULD_NOT_BE_INDEXED
description: External target.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`,
    );
    await writeFile(
      path.join(externalDirectoryPath, "directory-concept.md"),
      `---
type: Reference
title: EXTERNAL_DIRECTORY_CONCEPT_SHOULD_NOT_BE_INDEXED
description: External directory target.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`,
    );
    try {
      await symlink(externalPath, path.join(wikiPath, "index.md"), "file");
      await symlink(
        externalConceptPath,
        path.join(wikiPath, "retrieval", "external.md"),
        "file",
      );
      await symlink(
        externalDirectoryPath,
        path.join(wikiPath, "retrieval", "external-directory"),
        "dir",
      );
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        ["EPERM", "EACCES", "ENOTSUP", "ENOSYS"].includes(String(error.code))
      ) {
        t.skip("The host does not allow creating file symlinks.");
        return;
      }
      throw error;
    }

    const index = await buildIndex(wikiPath, { now });
    const indexWarning = index.warnings.find(({ path: warningPath }) => warningPath === "index.md");
    assert.ok(indexWarning);
    assert.match(indexWarning.reason, /symbolic link/i);
    assert.equal(indexWarning.reason.includes("PRIVATE_CONTENT_SHOULD_NOT_APPEAR"), false);
    const conceptWarning = index.warnings.find(
      ({ path: warningPath }) => warningPath === "retrieval/external.md",
    );
    assert.ok(conceptWarning);
    assert.match(conceptWarning.reason, /symbolic link/i);
    assert.equal(index.getConcept("retrieval/external"), undefined);
    assert.equal(
      index.concepts.some(({ title }) => title === "EXTERNAL_CONCEPT_SHOULD_NOT_BE_INDEXED"),
      false,
    );
    const directoryWarning = index.warnings.find(
      ({ path: warningPath }) => warningPath === "retrieval/external-directory",
    );
    assert.ok(directoryWarning);
    assert.match(directoryWarning.reason, /symbolic link/i);
    assert.equal(
      index.concepts.some(
        ({ title }) => title === "EXTERNAL_DIRECTORY_CONCEPT_SHOULD_NOT_BE_INDEXED",
      ),
      false,
    );
  } finally {
    await rm(temporaryPath, { recursive: true, force: true });
  }
});

test("does not read hard-linked index or concept files", async (t) => {
  const temporaryPath = await mkdtemp(path.join(os.tmpdir(), "wiki-mcp-hardlink-"));
  const wikiPath = path.join(temporaryPath, "wiki");
  const externalIndexPath = path.join(temporaryPath, "private-index.md");
  const externalConceptPath = path.join(temporaryPath, "private-concept.md");
  await mkdir(path.join(wikiPath, "retrieval"), { recursive: true });

  try {
    await writeFile(
      externalIndexPath,
      `---
okf_version: 99
---
# PRIVATE_INDEX_SHOULD_NOT_BE_READ
`,
    );
    await writeFile(
      externalConceptPath,
      `---
type: Reference
title: EXTERNAL_HARDLINK_CONCEPT_SHOULD_NOT_BE_INDEXED
description: External hard link target.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`,
    );
    try {
      await link(externalIndexPath, path.join(wikiPath, "index.md"));
      await link(externalConceptPath, path.join(wikiPath, "retrieval", "hardlinked.md"));
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        ["EPERM", "EACCES", "ENOTSUP", "ENOSYS", "EXDEV"].includes(String(error.code))
      ) {
        t.skip("The host does not allow creating hard links.");
        return;
      }
      throw error;
    }

    const index = await buildIndex(wikiPath, { now });
    const warningByPath = new Map(index.warnings.map(({ path: warningPath, reason }) => [warningPath, reason]));

    assert.match(warningByPath.get("index.md"), /multiple hard links/i);
    assert.match(warningByPath.get("retrieval/hardlinked.md"), /multiple hard links/i);
    assert.equal(warningByPath.has("PRIVATE_INDEX_SHOULD_NOT_BE_READ"), false);
    assert.equal(index.getConcept("retrieval/hardlinked"), undefined);
    assert.equal(
      index.concepts.some(({ title }) => title === "EXTERNAL_HARDLINK_CONCEPT_SHOULD_NOT_BE_INDEXED"),
      false,
    );
  } finally {
    await rm(temporaryPath, { recursive: true, force: true });
  }
});

test("searches boosted metadata and body fields while filtering by type", async () => {
  const wikiPath = await createTemporaryWiki({
    "retrieval/search-boosted.md": `---
type: Reference
title: titleboost
description: descriptionboost metadata.
tags: [tagboost, retrieval]
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources:
  - id: parser-source
    title: sourcesonlytoken
---
The body also mentions titleboost, descriptionboost, and tagboost.
`,
    "retrieval/search-body.md": `---
type: Guide
title: Search body
description: Body-only content.
tags: [retrieval]
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
titleboost descriptionboost tagboost
`,
  });

  try {
    const index = await buildIndex(wikiPath, { now });

    for (const query of ["titleboost", "descriptionboost", "tagboost"]) {
      const results = index.search(query);
      assert.equal(results[0]?.path, "retrieval/search-boosted");
      assert.equal(results.length, 2);
    }

    assert.deepEqual(
      index.search("titleboost", { type: "Guide" }).map(({ path: conceptPath }) => conceptPath),
      ["retrieval/search-body"],
    );
    assert.ok(
      index
        .search("retrieval", { tag: "retrieval" })
        .every(({ tags }) => tags.includes("retrieval")),
    );
    assert.deepEqual(index.search("sourcesonlytoken"), []);
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("excludes reserved catalog files from the concept index", async () => {
  const concept = `---
type: Reference
title: Temporary concept
description: Reserved-file test.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
`;
  const wikiPath = await createTemporaryWiki({
    "index.md": `---
okf_version: "0.2"
---
`,
    "retrieval/index.md": concept,
    "retrieval/log.md": concept,
    "retrieval/regular.md": concept,
  });

  try {
    const index = await buildIndex(wikiPath, { now });

    assert.deepEqual(
      index.concepts.map(({ path: conceptPath }) => conceptPath),
      ["retrieval/regular"],
    );
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("sweeps changed files and can force a full reindex", async () => {
  const wikiPath = await mkdtemp(path.join(os.tmpdir(), "wiki-mcp-indexer-"));
  const conceptFilePath = path.join(wikiPath, "pages", "item.md");

  try {
    await mkdir(path.dirname(conceptFilePath), { recursive: true });
    await writeFile(
      conceptFilePath,
      `---
type: Reference
title: Original item
description: The original description.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
# Original item
`,
    );
    const index = await buildIndex(wikiPath, { now });
    assert.equal(index.getConcept("pages/item")?.title, "Original item");

    await writeFile(
      conceptFilePath,
      `---
type: Reference
title: Changed item
description: A new description with a different size.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
# Changed item
See [missing](missing.md).
`,
    );
    const [sweep, concurrentSweep] = await Promise.all([
      index.sweepChanged(),
      index.sweepChanged(),
    ]);

    assert.deepEqual(sweep.reparsed, ["pages/item.md"]);
    assert.deepEqual(sweep.removed, []);
    assert.deepEqual(concurrentSweep.reparsed, []);
    assert.equal(index.getConcept("pages/item")?.title, "Changed item");
    assert.equal(index.search("changed item")[0]?.path, "pages/item");
    assert.ok(
      index.graph.edges.some(
        (edge) => edge.kind === "link" && edge.target === "pages/missing" && edge.dangling,
      ),
    );

    const unchangedSweep = await index.sweepChanged();
    assert.deepEqual(unchangedSweep.reparsed, []);
    assert.deepEqual(unchangedSweep.removed, []);

    await writeFile(
      conceptFilePath,
      `---
type: Reference
title: Reindexed item
description: A full reindex must reload this content.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
# Reindexed item
`,
    );
    const rebuild = await index.reindex();
    assert.equal(rebuild.indexed, 1);
    assert.deepEqual(rebuild.skipped, []);
    assert.equal(index.getConcept("pages/item")?.title, "Reindexed item");
    assert.deepEqual(index.graph.edges, []);

    const addedFilePath = path.join(wikiPath, "pages", "added.md");
    await writeFile(
      addedFilePath,
      `---
type: Guide
title: Added item
description: A new concept found by the mtime sweep.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
# Added item
`,
    );
    const addedSweep = await index.sweepChanged();
    assert.deepEqual(addedSweep.reparsed, ["pages/added.md"]);
    assert.equal(index.getConcept("pages/added")?.title, "Added item");

    await rm(conceptFilePath);
    const removalSweep = await index.sweepChanged();
    assert.deepEqual(removalSweep.removed, ["pages/item.md"]);
    assert.equal(index.getConcept("pages/item"), undefined);
    assert.deepEqual(index.search("reindexed"), []);
  } finally {
    await rm(wikiPath, { recursive: true, force: true });
  }
});
