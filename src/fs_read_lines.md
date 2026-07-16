Reads a file as UTF-8 and splits it on `'\n'`.
The trailing newline is NOT stripped: a file ending in `\n` yields a final `''` element.

```js
// file content: 'one\ntwo\n'
await fs_read_lines(file); // ['one', 'two', '']
```
