Connects to an sftp server described by a URL
(`sftp://user:pass@host:port/path`) and returns `{stat, lstat, readdir}` for
the path. Credentials are percent-decoded from the URL; the port defaults
to 22. The connection is always closed afterwards, on success and on failure.

The server's host key must be pinned: add `?fingerprint=SHA256:...` to the
URL or pass `{fingerprint}`. Without it the call rejects with the code
`ERR_SFTP_HOST_KEY_NOT_PINNED` before the password is sent, naming the
fingerprint the server presented (see `sftp_connect`).

Rejects on connection or authentication errors, and when the path does not
exist. The optional `user_friendly_status` callback receives progress
messages (`'Establishing connection...'`, ...).

```js
const info = await sftp_get_file_info('sftp://user:p%40ss@example.com/upload?fingerprint=SHA256:mEy/QR7so0+QUZXGSoxOzuLJ5MCzRPdxrxoOivArdH4');
info.stat.isDirectory() // true
info.readdir[0]         // {filename, longname, attrs}
```
