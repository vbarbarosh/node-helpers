Thin wrapper over node's `path.extname(p)`, kept for the consistent `fs_*` naming.
Returns the extension including the dot, or `''` when there is none — note node's dotfile rules:

```js
fs_path_extname('file.js');   // '.js'
fs_path_extname('.foo');      // ''
fs_path_extname('..foo');     // '.foo'
fs_path_extname('/a/b.js/c'); // ''
```
