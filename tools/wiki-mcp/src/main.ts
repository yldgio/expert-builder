const usage = `Usage: wiki-server [options]

Options:
  --help                   Show this help message
  --wiki <path>            Wiki directory to index
  --needs-review-days <n>  Days since verification before review (default: 7)
`;

if (process.argv.includes("--help")) {
  process.stdout.write(usage);
}
