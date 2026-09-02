Decrypts a `Buffer` envelope produced by `crypto_encrypt_aes256` and returns
the plaintext as a `Buffer` — call `.toString('utf8')` for text.

The version 1 envelope is
`[0x01][16-byte salt][12-byte nonce][16-byte GCM tag][ciphertext]`
(`aes-256-gcm`, key = `crypto.scryptSync(password, salt, 32)`, header
authenticated as additional data). Decryption **throws** when:

- the password is wrong or the envelope was modified in any byte
  (`authentication failed (wrong password or tampered data)`);
- the envelope is malformed: not a `Buffer`/`Uint8Array`, too short, or an
  unknown version byte (`malformed envelope`).

```js
const envelope = crypto_encrypt_aes256('pass123', 'hello');
crypto_decrypt_aes256('pass123', envelope).toString('utf8');   // 'hello'
crypto_decrypt_aes256('wrong', envelope);                      // throws
```
