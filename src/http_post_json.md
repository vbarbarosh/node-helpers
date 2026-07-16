Sends a `POST` request via axios with `body` as the request payload (a plain
object is serialized as JSON by axios) and resolves with `response.data`.
Extra axios options pass through.

```js
await http_post_json('https://api.example.com/items', {title: 'Hello'})
// → parsed response body
```

See also `http_post_urlencoded` and `http_post_multipart` for other request
body encodings.
