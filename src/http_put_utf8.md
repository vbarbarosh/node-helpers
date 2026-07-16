Sends a `PUT` request via axios with a string body sent as-is and resolves
with `response.data`. Extra axios options — e.g. a `Content-Type` header —
pass through.

```js
await http_put_utf8(upload_url, csv, {headers: {'Content-Type': 'text/csv'}});
```

Sibling of `http_put_buffer` (binary body) and `http_put_json` (JSON body).
