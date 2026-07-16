Downloads `url` into `out_file`.

- An HTTP error status (e.g. 404) rejects and does not create `out_file` —
  the file is only created after a successful response.
- Rejects when the server aborts the download mid-stream (no hanging) and
  when `out_file` is not writable; both streams are destroyed on any failure.
- `options` are passed through to `axios.get` (after
  `responseType: 'stream'`).

## Signature

```
http_get_file(url, out_file, options) → Promise<void>
```
