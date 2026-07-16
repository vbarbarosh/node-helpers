Sends a `GET` request via axios with `responseType: 'text'` and
`responseEncoding: 'utf8'`, and resolves with `response.data` — the body as a
UTF-8 string. Extra axios options pass through.

```js
const html = await http_get_utf8('https://example.com/');
```

See also `http_get_json` (parsed JSON) and `http_get_buffer` (binary).
