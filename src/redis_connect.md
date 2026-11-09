Connects to redis from a URL and returns a connected `redis` (node-redis v4+
style) client. `tcp://` is rewritten to `redis://`; `tls://` is rewritten to
`rediss://`. The password comes from the URL userinfo (URL-decoded) or,
failing that, from a `?password=` query parameter.

**Signature:** `redis_connect(url, options = {}) → Promise<client>`

`options` are passed to `redis.createClient`; `options.socket` goes to
`tls.connect` for a `tls://` URL.

A `tls://` connection verifies the server's certificate and the name it was
issued for, and rejects before the password is sent when either fails
(`DEPTH_ZERO_SELF_SIGNED_CERT`, `ERR_TLS_CERT_ALTNAME_INVALID`, ...). For a
private or self-signed certificate, supply its authority:

```js
await redis_connect('tcp://127.0.0.1:6379');
await redis_connect('tls://redis.example.com:6378?password=xxx');
await redis_connect('tls://10.0.0.5:6378?password=xxx', {socket: {ca: fs.readFileSync('ca.pem')}});
```

Verification is turned off only on request: by the caller's own
`options.socket` (`rejectUnauthorized`, `checkServerIdentity`), or by the URL
itself, with the switches PHP stream contexts use, so one URL can be shared
with PHP services:

- `ssl[verify_peer_name]=0` skips the name check and still verifies the
  certificate;
- `ssl[verify_peer]=0` skips verification altogether and emits a process
  warning with the code `REDIS_CONNECT_TLS_NOT_VERIFIED`. Anyone on the
  network path can then read the password and the traffic.

```js
await redis_connect('tls://11.11.11.11:6378?password=xxx&ssl[verify_peer]=0&ssl[verify_peer_name]=0');
```

Up to v3.79.2 every `tls://` connection skipped verification.
