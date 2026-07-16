Sends a `GET` request via axios with `responseType: 'blob'` and resolves with
`response.data` — a `Blob`. Meant for browser code; in Node prefer
`http_get_buffer` (Buffer) or `http_get_stream` (readable stream). Extra axios
options pass through.

```js
const blob = await http_get_blob('https://example.com/image.png');
```
