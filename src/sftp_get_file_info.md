Connects to an sftp server described by a URL
(`sftp://user:pass@host:port/path`) and returns `{stat, lstat, readdir}` for
the path. Credentials are percent-decoded from the URL; the port defaults
to 22. The connection is always closed afterwards, on success and on failure.

Rejects on connection or authentication errors, and when the path does not
exist. The optional `user_friendly_status` callback receives progress
messages (`'Establishing connection...'`, ...).

```js
const info = await sftp_get_file_info('sftp://user:p%40ss@example.com/upload');
info.stat.isDirectory() // true
info.readdir[0]         // {filename, longname, attrs}
```
