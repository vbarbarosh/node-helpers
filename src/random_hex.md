Returns `bytes` cryptographically random bytes (`crypto.randomBytes`) as a
lowercase hex string — 2 characters per byte. Defaults to 32 bytes (64 hex
characters).

```js
random_hex(4)   // '0566a554'
random_hex()    // 64-character hex string
random_hex(0)   // ''
```
