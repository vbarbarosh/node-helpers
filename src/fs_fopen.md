Opens a file and resolves with a numeric file descriptor for use with
`fs_fread`, `fs_fwrite`, `fs_fstat`, `fs_fsize` and `fs_fclose`.

```js
fs_fopen(file, flags = 'r', mode = 0o666) → Promise<number>
```
