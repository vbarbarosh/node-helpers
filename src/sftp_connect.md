Connects to an ssh server described by a URL
(`sftp://user:pass@host:port/path`) and resolves with a ready `ssh2.Client`.
When a fingerprint is given, the server's host key is checked against it
first. Credentials are percent-decoded; the port defaults to 22.
`sftp_get_file_info` and `sftp_get_stream_range` connect through it.

**Signature:** `sftp_connect(url, {fingerprint} = {}) → Promise<ssh2.Client>`

The fingerprint is the one `ssh-keygen -l` and `ssh` itself print,
`SHA256:...`. It comes from the `fingerprint` option (a string, or an array
while a key is being rotated) or from a `fingerprint=` parameter of the URL
(several separated by commas):

```js
const conn = await sftp_connect('sftp://user:pass@example.com/upload?fingerprint=SHA256:mEy/QR7so0+QUZXGSoxOzuLJ5MCzRPdxrxoOivArdH4');
conn.end();
```

The host key is looked at before any credentials are sent:

- the fingerprint given: connects;
- another fingerprint than the one given: rejects with the code
  `ERR_SFTP_HOST_KEY_MISMATCH`, and `error.fingerprint` carries the one the
  server presented. Nothing is sent to that server;
- no fingerprint: connects without verifying, as up to v3.79.2, and emits a
  process warning with the code `SFTP_HOST_KEY_NOT_VERIFIED`. The warning
  names the fingerprint the server presented, ready to be pinned once it is
  confirmed to be the right server
  (`ssh-keyscan example.com | ssh-keygen -lf -` prints the same). Whoever
  answers at that address receives the password;
- `fingerprint=any`: the same, said on purpose: any host key is accepted,
  with a warning of the same code.

The warning comes once for a server in the life of the process, however many
connections go to it:

```js
process.on('warning', function (warning) {
    if (warning.code === 'SFTP_HOST_KEY_NOT_VERIFIED') {
        // sftp_connect: the host key of example.com:22 is not verified, no fingerprint is given; it presented SHA256:...
    }
});
```

v3.80.0 and v3.80.1 refused a URL with no fingerprint
(`ERR_SFTP_HOST_KEY_NOT_PINNED`), which stopped every call written for an
earlier 3.x; later versions connect again, with the warning.

**Under npm 12.** `ssh2` builds its encryption when it is installed, and
npm 12 blocks an install script the project has not allowed. The install then
ends with `install scripts blocked`, `ssh2` falls back to JavaScript, and a
transfer is about fifty times slower (1 MiB in 4.8 s instead of 0.1 s in this
package's tests). Allow the two scripts in the project that installs this
package, then install again or rebuild:

```sh
npm install-scripts approve ssh2 cpu-features
npm rebuild ssh2 cpu-features
```

The list is the project's own `allowScripts` in `package.json`; the one in
this package covers only its own checkout. The build needs a compiler.
