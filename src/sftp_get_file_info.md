Connects to an sftp server described by a URL
(`sftp://user:pass@host:port/path`) and returns `{stat, lstat, readdir}` for
the path. Credentials are percent-decoded from the URL; the port defaults
to 22. The connection is always closed afterwards, on success and on failure.

To have the server verified, pin its host key: add
`?fingerprint=SHA256:...` to the URL or pass `{fingerprint}`. A server with
another key is then refused with the code `ERR_SFTP_HOST_KEY_MISMATCH` before
the password is sent. Without a fingerprint the call connects unverified, as
up to v3.79.2, and a process warning names the fingerprint the server
presented, once for a server (see `sftp_connect`).

Under npm 12 the install script of `ssh2` has to be allowed, or transfers
are many times slower (see `sftp_connect`).

Rejects on connection or authentication errors, and when the path does not
exist. The optional `user_friendly_status` callback receives progress
messages (`'Establishing connection...'`, ...).

```js
const info = await sftp_get_file_info('sftp://user:p%40ss@example.com/upload?fingerprint=SHA256:mEy/QR7so0+QUZXGSoxOzuLJ5MCzRPdxrxoOivArdH4');
info.stat.isDirectory() // true
info.readdir[0]         // {filename, longname, attrs}
```
