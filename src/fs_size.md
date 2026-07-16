Resolves with the size of a file in bytes (`fs_stat(path)` → `stat.size`).
Rejects if the path is missing; see `fs_size_enoent` for the variant that returns 0 instead.

```js
fs_size(path) → Promise<number>
```
