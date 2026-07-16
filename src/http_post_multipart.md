Sends a `POST` request with a `multipart/form-data` body built from an array
of `{name, body, options}` items and resolves with `response.data`. `body` may
be a string, Buffer, or readable stream; `options` (e.g. `{filename}`) is
passed to `FormData#append` when present. In Node the `form-data` package is
used and its boundary headers are merged into `options.headers`; in the
browser (with `form-data` webpack-externed to the native `FormData`) the form
is posted as-is. Extra axios options pass through.

```js
const items = [
    {name: 'subject', body: 'Hello'},
    {name: 'attachment', body: fs_read_stream(file), options: {filename: 'hello.txt'}},
];
await http_post_multipart(url, items, {auth});
```
