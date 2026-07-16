Sends a `GET` request via axios with `responseType: 'json'` and resolves with
`response.data` — the parsed response body. Extra axios options (headers,
params, timeout, ...) pass through.

```js
const user = await http_get_json('https://api.example.com/users/15');
```

See also `http_get_utf8` (raw string), `http_get_buffer`/`http_get_blob`
(binary), `http_get_stream` (readable stream).
