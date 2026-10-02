import { copyFile, mkdir } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builderDirectory = resolve(repositoryRoot, ".agents", "skills", "expert-builder");
const source = resolve(repositoryRoot, "tools", "wiki-mcp", "dist", "wiki-server.mjs");
const destination = resolve(builderDirectory, "assets", "wiki-mcp", "wiki-server.mjs");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log(`Updated ${relative(repositoryRoot, destination)} from ${relative(repositoryRoot, source)}`);
