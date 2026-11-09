Opens a byte range of a remote file over sftp and returns it as a readable
stream. The URL carries the connection details
(`sftp://user:pass@host:port/path`); credentials are percent-decoded, the
port defaults to 22. `first` and `last` are inclusive byte offsets.

The server's host key must be pinned: add `?fingerprint=SHA256:...` to the
URL or pass `{fingerprint}`. Without it the call rejects with the code
`ERR_SFTP_HOST_KEY_NOT_PINNED` before the password is sent, naming the
fingerprint the server presented (see `sftp_connect`).

The file is `stat`ed first: `first < 0` or `last >= size` rejects with an
`Invalid range` error (no clamping, unlike `http_range_parse`). Like
`http_get_stream_range`, the stream gets `content_range`
(`{type, first, last, total}`) and `total` (the full file size) attached.

The ssh connection is destroyed when the stream closes — on end, on error,
and also when the consumer destroys the stream early (e.g. an aborted http
range request); nothing leaks. Setup failures (bad credentials, missing
file, invalid range) also close the connection before rejecting. The
optional `user_friendly_status` callback receives progress messages.

```js
const rs = await sftp_get_stream_range(url, 0, 1023, {user_friendly_status: console.log});
rs.total // full file size
```
