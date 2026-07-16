Copies `src` to `dest`, overwriting `dest` if it exists.
Thin wrapper over `fs.promises.copyFile(src, dest, mode)`; `mode` takes `fs.constants` copy flags.
Use `fs_copy_excl` to fail instead of overwriting.

```js
fs_copy(src, dest, mode) → Promise<void>
```
