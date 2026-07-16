Promisified `fs.readlink`: resolves with the target a symbolic link points to.
Rejects if the path is missing or not a symlink (`EINVAL`).

```js
fs_readlink(path) → Promise<string>
```
