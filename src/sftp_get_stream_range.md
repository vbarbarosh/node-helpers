Opens a byte range of a remote file over sftp and returns it as a readable
stream. The URL carries the connection details
(`sftp://user:pass@host:port/path`); credentials are percent-decoded, the
port defaults to 22. `first` and `last` are inclusive byte offsets.

To have the server verified, pin its host key: add
`?fingerprint=SHA256:...` to the URL or pass `{fingerprint}`. A server with
another key is then refused with the code `ERR_SFTP_HOST_KEY_MISMATCH` before
the password is sent. Without a fingerprint the call connects unverified, as
up to v3.79.2, and a process warning names the fingerprint the server
presented, once for a server (see `sftp_connect`).

Under npm 12 the install script of `ssh2` has to be allowed, or transfers
are many times slower (see `sftp_connect`).

The file is `stat`ed first, and the range is answered as an HTTP server
answers one. A `last` at or past the end of the file is cut to its last byte,
so a caller may ask for a range before it knows the size, as `fastdl` does.
Only a range that starts outside the file (`first < 0` or `first >= size`)
rejects with an `Invalid range` error. Like `http_get_stream_range`, the
stream gets `content_range` (`{type, first, last, total}`, `last` being the
byte the stream ends at) and `total` (the full file size) attached.

An empty file has no byte to start at: a range from `0` resolves with an
empty stream whose `content_range` is
`{type: 'bytes', first: null, last: null, total: 0}`, as
`Content-Range: bytes */0` parses, and the connection is closed before the
call returns.

The ssh connection is destroyed when the stream closes — on end, on error,
and also when the consumer destroys the stream early (e.g. an aborted http
range request); nothing leaks. Setup failures (bad credentials, missing
file, invalid range) also close the connection before rejecting. The
optional `user_friendly_status` callback receives progress messages.

```js
const rs = await sftp_get_stream_range(url, 0, 1023, {user_friendly_status: console.log});
rs.total              // full file size
rs.content_range.last // 1023, or the last byte of a shorter file
```
