GETs `url` with a `Range: bytes=first-last` header and returns the response
body as a readable stream. Either bound may be omitted (non-integer) to send
an open-ended range; with both omitted a plain `bytes=-` request degrades to
a regular GET.

The stream gets extra properties attached: `headers` (raw response headers),
`content_range` (parsed `{type, first, last, total}`), and `total`. When the
server sends no `Content-Range`, it is synthesized from `Content-Length`; a
chunked 200 response (neither header) is accepted as
`{first: 0, last: null, total: null}` — body starts at byte 0, size unknown.

The returned range is validated: a `first` or `last` that differs from the
request destroys the stream with an error (reading it rejects) — this also
catches a server that ignores the range and replies 200. A `last` clamped to
the end of the resource is accepted: `bytes=0-999999` of a 500-byte file is
`bytes 0-499/500` (RFC 7233).

```js
const rs = await http_get_stream_range(url, 100, 199);
rs.content_range // {type: 'bytes', first: 100, last: 199, total: 1000}
rs.total         // 1000 (null when unknown)
```
