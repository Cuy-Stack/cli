# cuystack-cli

CLI sederhana untuk menjalankan dokumentasi statis cuystack secara lokal.

## Requirements

- Bun (runtime)

## Install dependencies

```bash
bun install
```

## Menjalankan CLI secara lokal

```bash
bun ./bin/cli.ts docs
```

## Command

### docs

Menjalankan docs server dari folder docs-ui.

Default port: 6969

```bash
cuystack docs
```

### Opsi port

Semua format berikut didukung:

```bash
cuystack docs -p 7001
cuystack docs --port 7001
cuystack docs --port=7001
```

Port valid ada di rentang 1-65535.

## Output

Saat server berhasil start, CLI akan menampilkan URL seperti:

```text
Docs running at http://localhost:7001
```

## Development notes

- Entry point CLI: bin/cli.ts
- Docs server: src/docs.ts
- Static assets docs: docs-ui/
