Reads up to `size` bytes (default: the buffer length) from a file descriptor into the start of `buffer`.
With `offset = null` (default) it reads from the current file position and advances it;
an explicit `offset` reads at that position without moving it.
Resolves with the filled part of the buffer: `buffer` itself when filled exactly,
otherwise `buffer.subarray(0, bytes_read)` — an empty chunk past the end of file.

```js
const fp = await fs_fopen(file);                      // file content: 'hello world'
await fs_fread(fp, Buffer.alloc(1024), 6, 5);         // <Buffer 'world'>
await fs_fread(fp, Buffer.alloc(1024), 100);          // <Buffer > (length 0)
```
