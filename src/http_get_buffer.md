Sends a `GET` request via axios with `responseType: 'arraybuffer'` and
resolves with `response.data` — a `Buffer` in Node, an `ArrayBuffer` in the
browser. Extra axios options pass through.

```js
const buf = await http_get_buffer('https://example.com/image.png');
```

See also `http_get_utf8` (string), `http_get_json` (parsed JSON),
`http_get_blob` (browser Blob), `http_get_stream` (readable stream).
