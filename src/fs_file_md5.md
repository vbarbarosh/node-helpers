Computes the MD5 of a file by streaming it (constant memory regardless of
file size). The second argument is the digest encoding, `'hex'` by default;
any `crypto` digest encoding (e.g. `'base64'`) works.

```js
await fs_file_md5('/tmp/data.txt')           // '5eb63bbbe01eeed093cb22bb8f5acdc3'
await fs_file_md5('/tmp/data.txt', 'base64') // 'XrY7u+Ae7tCTyyK7j1rNww=='
```
