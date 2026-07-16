Reads a file as UTF-8 and parses it with `JSON.parse`.
Rejects if the file is missing or the content is not valid JSON.

```js
fs_read_json(file) → Promise<any>
```
