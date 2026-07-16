Appends a value to a file as one line of JSON (JSON Lines format).
The value is serialized with `json_stringify_stable` (object keys sorted) and followed by a newline.

```js
await fs_append_json(file, {b: 1, a: [2]});
await fs_append_json(file, 'x');
// file content: '{"a":[2],"b":1}\n"x"\n'
```
