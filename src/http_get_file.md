Downloads `url` into `out_file`.

- The response is written to a unique temporary file in the destination
  directory, flushed, closed, and atomically renamed to `out_file` only after
  the complete download succeeds.
- An HTTP error status (e.g. 404) rejects without creating `out_file`.
- Rejects when the server aborts the download mid-stream (no hanging) and
  when `out_file` is not writable; both streams are destroyed and the
  temporary file is removed on failure. An existing `out_file` remains
  unchanged.
- `options` are passed through to `axios.get` (after
  `responseType: 'stream'`).

## Signature

```
http_get_file(url, out_file, options) → Promise<void>
```
