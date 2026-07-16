Thin wrapper over `fs.promises.readFile(path, options)`.
Without an `encoding` in `options` it resolves with a `Buffer`; with one, a string.
Prefer the specialized variants: `fs_read_buffer`, `fs_read_utf8`, `fs_read_json`, `fs_read_lines`.
