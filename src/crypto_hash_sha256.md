Computes the SHA-256 hash of a string or `Buffer`. Returns a 32-byte `Buffer`
— call `.toString('hex')` for the usual hex digest.

```js
crypto_hash_sha256('hello').toString('hex')
// '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
```

For a keyed hash (verifying that data came from someone who knows a secret)
use `crypto_hmac_sha256` instead of hashing a concatenation.
