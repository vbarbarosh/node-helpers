GETs `url` with a `Range: bytes=first-last` header and returns the response
body as a readable stream. Omitting `last` requests `bytes=first-`; omitting
`first` requests the final `last` bytes with `bytes=-last`. When both are
omitted, the `Range` header is omitted and a regular GET is sent. Extra Axios
options are accepted as the fourth argument; caller headers are merged with
the computed `Range` header.

The stream gets extra properties attached: `headers` (raw response headers),
`content_range` (parsed `{type, first, last, total}`), and `total`. When the
server sends no `Content-Range`, it is synthesized from `Content-Length`; a
chunked 200 response (neither header) is accepted as
`{first: 0, last: null, total: null}` — body starts at byte 0, size unknown.

The returned range is validated according to the requested form. Closed ranges
accept a `last` clamped to the end of the resource; open-ended ranges must end
at the resource end when its size is known; suffix ranges validate their
length and resource end, and a chunked 200 (unknown length) in reply to a
suffix request is rejected. A server that ignores a range and replies 200 is
rejected.

```js
const rs = await http_get_stream_range(url, 100, 199);
rs.content_range // {type: 'bytes', first: 100, last: 199, total: 1000}
rs.total         // 1000 (null when unknown)
```
