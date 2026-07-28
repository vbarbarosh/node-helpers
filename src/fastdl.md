Download a file in several connections in parallel.

All ranges are written to a unique temporary file beside `file`. After every
range completes and the final byte count is validated, the temporary file is
flushed, closed, and atomically renamed over `file`. A failed request, exhausted
retry, size mismatch, or write error removes the temporary file and preserves
an existing destination.

```js
await fastdl({
    file: fs_path_basename(new URL(url).pathname),
    read_stream_with_range: (first, last) => http_get_stream_range(url, first, last),
});
```
