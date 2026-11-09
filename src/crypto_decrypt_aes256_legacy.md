Reads an envelope that `crypto_encrypt_aes256` wrote **before v3.78.1** and
returns the plaintext as a `Buffer`. For migration only: read the old data
once and write it again with `crypto_encrypt_aes256`.

The old envelope is `[0x10][16-byte iv][ciphertext]` (`aes-256-ctr`,
key = `sha256(password)`). It has no integrity check, so this helper cannot
tell a wrong password or a modified envelope from a good one: it returns
garbage instead of throwing. That is why `crypto_decrypt_aes256` refuses the
old format and names this helper in its error.

Throws when the envelope is not in the old format: not a
`Buffer`/`Uint8Array`, shorter than 17 bytes, or a first byte other than
`0x10` (an envelope in the current format starts with `0x01`).

```js
// move one stored value to the current format
const plain = crypto_decrypt_aes256_legacy('pass123', old_envelope);
const envelope = crypto_encrypt_aes256('pass123', plain);

// read whichever format a stored value has
const plain = (value[0] === 0x10)
    ? crypto_decrypt_aes256_legacy('pass123', value)
    : crypto_decrypt_aes256('pass123', value);
```
