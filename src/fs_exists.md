Resolves with `true` if `path` is accessible and `false` otherwise; never rejects.
Follows symlinks (via `fs.access`), so a broken symlink reports `false`.

```js
fs_exists(path) → Promise<boolean>
```
