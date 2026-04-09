import { serve } from 'bun';
import { join } from 'path';

const DEFAULT_PORT = 6969;

export function parsePortArg(args: string[]): number {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg === '-p' || arg === '--port') {
      const value = args[i + 1];
      if (!value) {
        throw new Error('Missing value for --port');
      }

      const port = Number(value);
      if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid port: ${value}`);
      }

      return port;
    }

    if (arg.startsWith('--port=')) {
      const value = arg.split('=')[1];
      const port = Number(value);

      if (!Number.isInteger(port) || port <= 0 || port > 65535) {
        throw new Error(`Invalid port: ${value}`);
      }

      return port;
    }
  }

  return DEFAULT_PORT;
}

export function startDocsServer(port = DEFAULT_PORT) {
  serve({
    port,
    fetch(req) {
      const url = new URL(req.url);
      let path = url.pathname;

      if (path === '/') path = '/index.html';

      const filePath = join(import.meta.dir, '../docs-ui', path);

      const file = Bun.file(filePath);

      if (!file.exists()) {
        return new Response('Not found', { status: 404 });
      }

      return new Response(file);
    },
  });

  console.log(`Docs running at http://localhost:${port}`);
}

if (import.meta.main) {
  const port = parsePortArg(process.argv.slice(2));
  startDocsServer(port);
}
