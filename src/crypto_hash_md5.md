Computes the MD5 hash of a string or `Buffer`. Returns a 16-byte `Buffer` —
call `.toString('hex')` for the usual hex digest.

```js
crypto_hash_md5('hello').toString('hex')
// '5d41402abc4b2a76b9719d911017c592'
```

MD5 is broken for security purposes; use it for checksums and cache keys, and
`crypto_hash_sha256` where collision resistance matters.
