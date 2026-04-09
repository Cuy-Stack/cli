#!/usr/bin/env bun

import { outputError } from '../src/utils/generate-file.ts';

const args = process.argv.slice(2);

const command = args[0];

try {
  if (command === 'docs') {
    const docsArgs = args.slice(1);
    const { parsePortArg, startDocsServer } = await import('../src/docs.ts');
    const port = parsePortArg(docsArgs);
    startDocsServer(port);
  } else if (command === 'generate:controller') {
    const nameArg = args[1];
    let templateArg = args[2];

    for (let i = 2; i < args.length; i++) {
      const arg = args[i];
      if (!arg) continue;

      if (arg.startsWith('--template=')) {
        templateArg = arg.split('=')[1];
        break;
      }

      if (arg === '--template') {
        templateArg = args[i + 1];
        break;
      }
    }

    const { generateController } =
      await import('../src/generate-controller.ts');
    await generateController(nameArg, templateArg);
  } else {
    throw new Error('Unknown command');
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  outputError(message);
  process.exit(1);
}
