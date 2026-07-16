Promisified `fs.rename`: moves/renames a file or directory, overwriting an existing file at the destination.
Fails across filesystem boundaries (`EXDEV`) — copy + remove in that case.

```js
fs_rename(old_path, new_path) → Promise<void>
```
