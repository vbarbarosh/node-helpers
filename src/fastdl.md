Download a file in several connections in parallel.

`concurrency` defaults to `60` and must be a positive integer.

All ranges are written to a unique temporary file beside `file`. After every
range completes and the final byte count is validated, the temporary file is
flushed, closed, and atomically renamed over `file`. A failed request, exhausted
retry, size mismatch, or write error removes the temporary file and preserves
an existing destination.

`read_stream_with_range(first, last)` resolves with a readable stream of the
bytes `first` to `last`, both included, that carries `content_range`
(`{first, last, total}`). The first call asks for bytes `0` to `1,048,576`
before the size is known, so a range that ends past the resource must be
answered with what the resource has, `content_range.last` saying where it
ended. `http_get_stream_range` and `sftp_get_stream_range` answer so.

An empty resource, a `content_range.total` of `0`, is complete at once: the
destination becomes an empty file, the stream of the first call is closed
unread, and nothing more is asked.

The first range response must carry an integer `content_range.total`. When the
server ignores `Range` and answers with an unknown size (for example a chunked
200), the stream is destroyed and the call rejects with a `UserFriendlyError`
without leaving a progress timer behind.

```js
await fastdl({
    file: fs_path_basename(new URL(url).pathname),
    read_stream_with_range: (first, last) => http_get_stream_range(url, first, last),
});
```
