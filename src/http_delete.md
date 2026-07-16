Sends a `DELETE` request via axios with `responseType: 'json'` and resolves
with `response.data`. Extra axios options pass through (and may override the
defaults).

```js
await http_delete('https://api.example.com/items/15')
// → parsed response body
```

Sibling of `http_get_json`, `http_post_json`, `http_put_json`,
`http_patch_json`.
