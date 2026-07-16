Writes the whole `buffer` to a file descriptor and resolves with `bytes_written`.
With `offset = null` (default) it writes at the current file position;
pass an explicit `offset` to write at that position instead.

```js
const fp = await fs_fopen(file, 'w');
await fs_fwrite(fp, Buffer.from('hello world'));  // 11
await fs_fwrite(fp, Buffer.from('WORLD'), 6);     // 5 — file is now 'hello WORLD'
```
