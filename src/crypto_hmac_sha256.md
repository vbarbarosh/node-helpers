Computes the HMAC-SHA256 of `data` keyed with `password` (both strings or
`Buffer`s). Returns a 32-byte `Buffer` — call `.toString('hex')` for the usual
hex form.

```js
crypto_hmac_sha256('key', 'The quick brown fox jumps over the lazy dog').toString('hex')
// 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
```

Unlike `crypto_hash_sha256`, the output depends on the key, so it can
authenticate data: only holders of the key can produce or verify the mac.
