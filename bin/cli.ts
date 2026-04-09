#!/usr/bin/env bun

const args = process.argv.slice(2);

const command = args[0];

if (command === 'docs') {
  const docsArgs = args.slice(1);
  const { parsePortArg, startDocsServer } = await import('../src/docs.ts');
  const port = parsePortArg(docsArgs);
  startDocsServer(port);
} else {
  console.log('Unknown command');
}
