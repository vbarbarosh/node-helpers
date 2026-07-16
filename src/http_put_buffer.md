Sends a `PUT` request via axios with `body` (a Buffer, or anything axios
accepts as a request body) sent as-is, and resolves with `response.data`.
Extra axios options — e.g. a `Content-Type` header — pass through.

```js
await http_put_buffer(upload_url, buf, {headers: {'Content-Type': 'image/png'}});
```

Sibling of `http_put_utf8` (string body) and `http_put_json` (JSON body).
