Computes the SHA-256 of a file, streaming it in 1 MiB chunks (constant
memory regardless of file size). Returns the digest as a lowercase hex
string. Rejects with `ENOENT` for a missing file; an empty file gives the
well-known empty-input digest.

```js
await fs_sha256('/tmp/data.txt')
// '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' ('hello')
```
