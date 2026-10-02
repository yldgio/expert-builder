import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildIndex,
  type Concept,
  type GraphEdge,
  type UpdateState,
  type WikiIndexer,
} from "./indexer.js";

export * from "./indexer.js";

const usage = `Usage: wiki-server [options]

Options:
  --help                   Show this help message
  --wiki <path>            Wiki directory to index
  --needs-review-days <n>  Days since verification before review (default: 7)
`;

interface CliOptions {
  wikiPath: string;
  needsReviewDays: number;
}

interface ConceptSummary {
  path: string;
  title: string;
  type: string;
  tags: string[];
  update_state: UpdateState;
}

function parseCliArguments(args: string[]): CliOptions | "help" {
  if (args.includes("--help")) {
    return "help";
  }

  let wikiPath: string | undefined;
  let needsReviewDays = 7;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--wiki") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("--wiki requires a directory path.");
      }
      if (wikiPath !== undefined) {
        throw new Error("--wiki may only be provided once.");
      }
      wikiPath = value;
      index += 1;
    } else if (argument === "--needs-review-days") {
      const value = args[index + 1];
      if (!value || !/^\d+$/.test(value) || !Number.isSafeInteger(Number(value))) {
        throw new Error("--needs-review-days requires a non-negative integer.");
      }
      needsReviewDays = Number(value);
      index += 1;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  if (!wikiPath) {
    throw new Error("--wiki is required.");
  }
  return { wikiPath, needsReviewDays };
}

function getUpdateState(index: WikiIndexer, conceptPath: string): UpdateState {
  const state = index.getUpdateState(conceptPath);
  if (!state) {
    throw new Error(`Wiki concept was not found: ${conceptPath}`);
  }
  return state;
}

function summarizeConcept(index: WikiIndexer, concept: Concept): ConceptSummary {
  return {
    path: concept.path,
    title: concept.title,
    type: concept.type,
    tags: [...concept.tags],
    update_state: getUpdateState(index, concept.path),
  };
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function jsonResult(value: unknown) {
  return textResult(JSON.stringify(value, null, 2));
}

function formatUpdateState(state: UpdateState): string {
  return [
    `stale=${state.stale}`,
    `stale_after=${state.stale_after ?? "null"}`,
    `trust_tier=${state.trust_tier}`,
    `last_verified_at=${state.last_verified_at ?? "null"}`,
    `days_since_verified=${state.days_since_verified ?? "null"}`,
    `needs_review=${state.needs_review}`,
  ].join("; ");
}

function makeSnippet(body: string, query: string): string {
  const normalizedBody = body.replace(/\s+/g, " ").trim();
  if (!normalizedBody) {
    return "(No body text.)";
  }

  const lowerBody = normalizedBody.toLowerCase();
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);
  const matchIndex = terms
    .map((term) => lowerBody.indexOf(term))
    .find((index) => index >= 0);
  const start = Math.max(0, (matchIndex ?? 0) - 60);
  const excerpt = normalizedBody.slice(start, start + 200);
  return `${start > 0 ? "..." : ""}${excerpt}${start + excerpt.length < normalizedBody.length ? "..." : ""}`;
}

function createServer(index: WikiIndexer): McpServer {
  const server = new McpServer({ name: "wiki-mcp", version: "0.1.0" });

  server.registerTool(
    "wiki_search",
    {
      description: "Search indexed Wiki concepts and return ranked Markdown matches.",
      inputSchema: {
        query: z.string(),
        type: z.string().optional(),
        tag: z.string().optional(),
        limit: z.number().int().nonnegative().optional(),
      },
    },
    async ({ query, type, tag, limit }) => {
      await index.sweepChanged();
      const results = index.search(query, { type, tag, limit });
      if (results.length === 0) {
        return textResult("No matching concepts found.");
      }

      const matches = results.map((result) => {
        const concept = index.getConcept(result.path);
        if (!concept) {
          throw new Error(`Indexed concept disappeared during search: ${result.path}`);
        }
        const state = getUpdateState(index, concept.path);
        return [
          `### ${result.title}`,
          `- Path: \`${result.path}\``,
          `- Snippet: ${makeSnippet(concept.body, query)}`,
          `- Update state: ${formatUpdateState(state)}`,
        ].join("\n");
      });
      return textResult(matches.join("\n\n"));
    },
  );

  server.registerTool(
    "wiki_get_concept",
    {
      description: "Read a Wiki concept as Markdown with its frontmatter summary and update state.",
      inputSchema: { path: z.string() },
    },
    async ({ path: conceptPath }) => {
      await index.sweepChanged();
      const concept = index.getConcept(conceptPath);
      if (!concept) {
        throw new Error(`Wiki concept was not found: ${conceptPath}`);
      }
      const frontmatter = {
        type: concept.type,
        title: concept.title,
        description: concept.description,
        tags: concept.tags,
        generated: concept.generated,
        sources: concept.sources,
      };
      const state = getUpdateState(index, concept.path);
      return textResult(
        [
          `# ${concept.title}`,
          `**Path:** \`${concept.path}\``,
          "## Frontmatter summary",
          "```json",
          JSON.stringify(frontmatter, null, 2),
          "```",
          "## Update state",
          "```json",
          JSON.stringify(state, null, 2),
          "```",
          "## Body",
          concept.body.trim(),
        ].join("\n\n"),
      );
    },
  );

  server.registerTool(
    "wiki_list",
    {
      description: "List indexed Wiki concepts as JSON, with optional update-state filters.",
      inputSchema: {
        type: z.string().optional(),
        tag: z.string().optional(),
        stale: z.boolean().optional(),
        needs_review: z.boolean().optional(),
      },
    },
    async ({ type, tag, stale, needs_review }) => {
      await index.sweepChanged();
      const concepts = index.concepts
        .filter((concept) => type === undefined || concept.type === type)
        .filter((concept) => tag === undefined || concept.tags.includes(tag))
        .map((concept) => summarizeConcept(index, concept))
        .filter(({ update_state }) => stale === undefined || update_state.stale === stale)
        .filter(
          ({ update_state }) =>
            needs_review === undefined || update_state.needs_review === needs_review,
        );
      return jsonResult(concepts);
    },
  );

  server.registerTool(
    "wiki_status",
    { description: "Report Wiki index counts, update-state lists, warnings, and metadata." },
    async () => {
      await index.sweepChanged();
      const concepts = index.concepts.map((concept) => summarizeConcept(index, concept));
      const byTrustTier = {
        unverified: concepts.filter(
          ({ update_state }) => update_state.trust_tier === "unverified",
        ),
        "machine-confirmed": concepts.filter(
          ({ update_state }) => update_state.trust_tier === "machine-confirmed",
        ),
        "human-reviewed": concepts.filter(
          ({ update_state }) => update_state.trust_tier === "human-reviewed",
        ),
      };
      const stale = concepts.filter(({ update_state }) => update_state.stale);
      const notStale = concepts.filter(({ update_state }) => !update_state.stale);
      const needsReview = concepts.filter(({ update_state }) => update_state.needs_review);
      const noReviewNeeded = concepts.filter(({ update_state }) => !update_state.needs_review);

      return jsonResult({
        counts: {
          total: concepts.length,
          stale: stale.length,
          not_stale: notStale.length,
          needs_review: needsReview.length,
          no_review_needed: noReviewNeeded.length,
          by_trust_tier: Object.fromEntries(
            Object.entries(byTrustTier).map(([tier, items]) => [tier, items.length]),
          ),
        },
        by_update_state: {
          stale,
          not_stale: notStale,
          needs_review: needsReview,
          no_review_needed: noReviewNeeded,
          trust_tier: byTrustTier,
        },
        warnings: index.warnings.map(({ path: warningPath, reason }) => ({
          path: warningPath,
          reason,
        })),
        index: {
          wiki_path: index.wikiPath,
          needs_review_days: index.needsReviewDays,
          indexed_concepts: concepts.length,
        },
      });
    },
  );

  server.registerTool(
    "wiki_related",
    {
      description: "Return Wiki graph neighbors by link direction or shared tags as JSON.",
      inputSchema: {
        path: z.string(),
        depth: z.number().int().nonnegative().default(1),
      },
    },
    async ({ path: conceptPath, depth }) => {
      await index.sweepChanged();
      const concept = index.getConcept(conceptPath);
      if (!concept) {
        throw new Error(`Wiki concept was not found: ${conceptPath}`);
      }
      const neighbors: Array<{
        path: string;
        title: string;
        type: string;
        edge_kind: GraphEdge["kind"];
        direction: "in" | "out" | "shared-tag";
        depth: number;
        tags?: string[];
        update_state: UpdateState;
      }> = [];
      const visited = new Set([concept.path]);
      const emittedEdges = new Set<string>();
      let frontier = [concept.path];

      for (let level = 1; level <= depth && frontier.length > 0; level += 1) {
        const nextFrontier: string[] = [];
        for (const currentPath of frontier) {
          for (const edge of index.graph.edges) {
            let neighborPath: string | undefined;
            let direction: "in" | "out" | "shared-tag";
            if (edge.kind === "link") {
              if (edge.dangling) {
                continue;
              }
              if (edge.source === currentPath) {
                neighborPath = edge.target;
                direction = "out";
              } else if (edge.target === currentPath) {
                neighborPath = edge.source;
                direction = "in";
              } else {
                continue;
              }
            } else if (edge.source === currentPath) {
              neighborPath = edge.target;
              direction = "shared-tag";
            } else if (edge.target === currentPath) {
              neighborPath = edge.source;
              direction = "shared-tag";
            } else {
              continue;
            }

            const neighbor = index.getConcept(neighborPath);
            if (!neighbor) {
              continue;
            }
            const edgeKey = JSON.stringify([
              currentPath,
              neighborPath,
              edge.kind,
              direction,
              edge.kind === "shared-tag" ? edge.tags : [],
            ]);
            if (!emittedEdges.has(edgeKey)) {
              emittedEdges.add(edgeKey);
              neighbors.push({
                path: neighbor.path,
                title: neighbor.title,
                type: neighbor.type,
                edge_kind: edge.kind,
                direction,
                depth: level,
                ...(edge.kind === "shared-tag" ? { tags: [...edge.tags] } : {}),
                update_state: getUpdateState(index, neighbor.path),
              });
            }
            if (!visited.has(neighborPath)) {
              visited.add(neighborPath);
              nextFrontier.push(neighborPath);
            }
          }
        }
        frontier = nextFrontier;
      }

      return jsonResult({ path: concept.path, depth, neighbors });
    },
  );

  server.registerTool(
    "wiki_graph",
    { description: "Return the full Wiki concept graph as JSON, including node update state." },
    async () => {
      await index.sweepChanged();
      return jsonResult({
        nodes: index.graph.nodes.map((node) => ({
          ...node,
          update_state: getUpdateState(index, node.id),
        })),
        edges: index.graph.edges,
      });
    },
  );

  server.registerTool(
    "wiki_reindex",
    { description: "Rebuild the full Wiki index and report indexed and skipped files as JSON." },
    async () => {
      const report = await index.reindex();
      return jsonResult(report);
    },
  );

  return server;
}

async function runCli(args: string[]): Promise<void> {
  let options: CliOptions | "help";
  try {
    options = parseCliArguments(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${message}\n\n${usage.trimEnd()}`);
  }

  if (options === "help") {
    process.stdout.write(usage);
    return;
  }

  const index = await buildIndex(options.wikiPath, {
    needsReviewDays: options.needsReviewDays,
  });
  await createServer(index).connect(new StdioServerTransport());
}

function isDirectExecution(): boolean {
  return (
    process.argv[1] !== undefined &&
    fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
  );
}

if (isDirectExecution()) {
  runCli(process.argv.slice(2)).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`wiki-server: ${message}\n`);
    process.exitCode = 1;
  });
}
