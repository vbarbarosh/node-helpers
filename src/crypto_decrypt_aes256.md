Decrypts a `Buffer` produced by `crypto_encrypt_aes256` (`aes-256-ctr`, key =
`sha256(password)`, layout `[iv_length, iv, ciphertext]`). Returns the
plaintext as a `Buffer` — call `.toString('utf8')` for text.

```js
const ivenc = crypto_encrypt_aes256('pass123', 'hello');
crypto_decrypt_aes256('pass123', ivenc).toString('utf8');   // 'hello'
crypto_decrypt_aes256('wrong', ivenc).toString('utf8');     // garbage, no error
```

**No integrity check:** CTR mode does not authenticate — a wrong password or
tampered ciphertext yields garbage bytes, never an error, so verify the result
yourself if you need to detect bad input.
