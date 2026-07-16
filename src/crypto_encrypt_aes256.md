Encrypts data with `aes-256-ctr`. The key is `sha256(password)`, the IV is a
fresh random 16 bytes on every call, so encrypting the same input twice gives
different output. Returns a `Buffer` laid out as `[iv_length, iv, ciphertext]`
(1 + 16 + data-length bytes); pass it as-is to `crypto_decrypt_aes256`.

```js
const ivenc = crypto_encrypt_aes256('pass123', 'hello');
// <Buffer 10 ...> — 22 bytes: 0x10 (iv length), 16-byte iv, 5-byte ciphertext
crypto_decrypt_aes256('pass123', ivenc).toString('utf8');  // 'hello'
```

**No integrity check:** CTR mode does not authenticate — a wrong password or
tampered data decrypts to garbage, not an error.
