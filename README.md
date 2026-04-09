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
bunx cuystack docs
```

### Opsi port

Semua format berikut didukung:

```bash
bunx cuystack docs -p 7001
bunx cuystack docs --port 7001
bunx cuystack docs --port=7001
```

Port valid ada di rentang 1-65535.

### generate:controller

Generate file controller ke folder src/controllers dengan nama file kebab-case dan suffix .controller.ts.

Tanpa parameter (akan prompt nama controller dalam format PascalCase + pilihan template):

```bash
bun ./bin/cli.ts generate:controller
```

Dengan parameter nama (template akan dipilih via prompt):

```bash
bun ./bin/cli.ts generate:controller Test
```

Dengan parameter nama + template (langsung generate tanpa prompt template):

```bash
bun ./bin/cli.ts generate:controller Test basic
bun ./bin/cli.ts generate:controller Test crud
```

Atau menggunakan flag template:

```bash
bun ./bin/cli.ts generate:controller Test --template basic
bun ./bin/cli.ts generate:controller Test --template=crud
```

Rules:

- Nama controller wajib PascalCase, contoh: Test
- Nama file otomatis kebab-case + .controller.ts, contoh: test.controller.ts
- Output selalu ke folder src/controllers/
- Template tersedia: basic atau crud

## Output

Saat server berhasil start, CLI akan menampilkan URL seperti:

```text
Docs running at http://localhost:7001
```

## Development notes

- Entry point CLI: bin/cli.ts
- Docs server: src/docs.ts
- Static assets docs: docs-ui/
