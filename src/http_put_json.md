Sends a `PUT` request via axios with `body` as the request payload (a plain
object is serialized as JSON by axios) and resolves with `response.data`.
Extra axios options pass through.

```js
await http_put_json('https://api.example.com/items/15', {title: 'New title'})
// → parsed response body
```

Sibling of `http_post_json`, `http_patch_json`, `http_put_buffer`,
`http_put_utf8`.
