Serializes `data` with `JSON.stringify(data, null, 4)` and writes it to the file as UTF-8.
The output is pretty-printed with 4-space indentation and has no trailing newline.

```js
await fs_write_json(file, {name: 'x'});
// file content: '{\n    "name": "x"\n}'
```
