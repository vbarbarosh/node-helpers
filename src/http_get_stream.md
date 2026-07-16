Sends a `GET` request via axios with `responseType: 'stream'` and resolves
with the response's readable stream, decorated with two extra properties:
`headers` (the response headers) and `total` (the `Content-Length` as an
integer, or `null` when the header is missing or unparsable). Extra axios
options pass through.

```js
const stream = await http_get_stream('https://example.com/big.bin');
stream.total          // 3000000 (or null)
stream.headers        // response headers
stream.pipe(dest);
```

See also `http_get_buffer` when the whole body fits in memory.
