Creates the file if it does not exist, then sets its atime and mtime to now — like the `touch` command.
Rejects with `Cannot touch a directory: <file>` when the path is an existing directory.

```js
fs_touch(file) → Promise<void>
```
