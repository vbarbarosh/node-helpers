Connects to redis from a URL and returns a connected `redis` (node-redis v4+
style) client. `tcp://` is rewritten to `redis://`; `tls://` is rewritten to
`rediss://` with peer certificate verification disabled
(`rejectUnauthorized: false`). The password comes from the URL userinfo
(URL-decoded) or, failing that, from a `?password=` query parameter.

```js
await redis_connect('tcp://127.0.0.1:6379');
await redis_connect('tls://11.11.11.11:6378?password=xxx');
```
