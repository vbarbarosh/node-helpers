Express/Node request handler that streams a file from disk, honoring a single
HTTP `Range` header (parsed with `http_range_parse`; see its doc for supported
forms and clamping). `Content-Type` comes from `mime-types` lookup on the file
name.

## Signature

```
http_stream_range(req, res, file) → Promise
```

- `HEAD` → 200 with `Content-Type`, `Content-Length`, and an
  `inline; filename=...` `Content-Disposition` (escaped via
  `escape_content_disposition`); no body.
- `GET` with `Range` → 206 with `Content-Range: bytes first-last/total` and a
  matching `Content-Length`.
- `GET` without `Range` → the whole file (no explicit status; 200).
- Any other method → 405.

Reads in 2 MiB chunks with an `fs_fread` loop, respecting backpressure
(`res.write` + `drain`) and stopping early when the client disconnects.

```js
app.get('/file', (req, res) => http_stream_range(req, res, '/data/movie.mp4'));
```
