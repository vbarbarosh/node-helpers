Download a file in several connections in parallel.

```js
await fastdl({
    file: fs_path_basename(new URL(url).pathname),
    read_stream_with_range: (first, last) => http_get_stream_range(url, first, last),
});
```
