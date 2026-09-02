Encrypts data with a password using authenticated encryption. Returns a
`Buffer` envelope; pass it as-is to `crypto_decrypt_aes256`.

**Envelope (version 1), 45 bytes + data length:**

```
[0x01][16-byte salt][12-byte nonce][16-byte GCM tag][ciphertext]
```

- The key is `crypto.scryptSync(password, salt, 32)` with a fresh random salt
  per call, so guessing passwords offline is expensive and the same password
  never yields the same key twice.
- The cipher is `aes-256-gcm` with a fresh random nonce per call; the
  version/salt/nonce header is authenticated as additional data together with
  the ciphertext. Any modification of the envelope, or a wrong password, makes
  `crypto_decrypt_aes256` throw instead of returning garbage.
- Encrypting the same input twice gives different output.

```js
const envelope = crypto_encrypt_aes256('pass123', 'hello');
// <Buffer 01 ...> — 50 bytes: version, 16-byte salt, 12-byte nonce, 16-byte tag, 5-byte ciphertext
crypto_decrypt_aes256('pass123', envelope).toString('utf8');  // 'hello'
```
