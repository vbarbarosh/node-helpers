Sends a `HEAD` request via axios and resolves with the raw response headers
(`response.request.res.headers` — the Node http headers object, keys
lowercased), not the body. Extra axios options pass through.

```js
const headers = await http_head('https://example.com/file.bin');
headers['content-length'] // '3000000'
headers['content-type']   // 'application/octet-stream'
```
