Decrypts a `Buffer` envelope produced by `crypto_encrypt_aes256` and returns
the plaintext as a `Buffer` — call `.toString('utf8')` for text.

The version 1 envelope is
`[0x01][16-byte salt][12-byte nonce][16-byte GCM tag][ciphertext]`
(`aes-256-gcm`, key = `crypto.scryptSync(password, salt, 32)`, header
authenticated as additional data). Decryption **throws** when:

- the password is wrong or the envelope was modified in any byte
  (`authentication failed (wrong password or tampered data)`);
- the envelope is malformed: not a `Buffer`/`Uint8Array`, too short, or an
  unknown version byte (`malformed envelope`);
- the envelope was written before v3.78.1 (`envelope in the format written
  before v3.78.1`), see below.

```js
const envelope = crypto_encrypt_aes256('pass123', 'hello');
crypto_decrypt_aes256('pass123', envelope).toString('utf8');   // 'hello'
crypto_decrypt_aes256('wrong', envelope);                      // throws
```

**Data encrypted before v3.78.1.** Up to v3.78.0 the envelope was
`[0x10][16-byte iv][ciphertext]` (`aes-256-ctr`, key = `sha256(password)`),
with no integrity check. This helper refuses it; read it with
`crypto_decrypt_aes256_legacy` and write it again with
`crypto_encrypt_aes256`:

```js
const envelope = crypto_encrypt_aes256('pass123', crypto_decrypt_aes256_legacy('pass123', old_envelope));
```
