Appends data to a file, creating the file if it does not exist.
Thin wrapper over `fs.promises.appendFile(file, data, options)`; `data` may be a string or a `Buffer`.
See `fs_append_utf8` for text and `fs_append_json` for JSON lines.

```js
fs_append(file, data, options) → Promise<void>
```
