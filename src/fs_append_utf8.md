Appends text to a file, creating the file if it does not exist.
Same wrapper over `fs.promises.appendFile` as `fs_append`; the name documents the intent (UTF-8 is the default encoding).

```js
fs_append_utf8(file, text, options) → Promise<void>
```
