Creates a directory and any missing parents (`mkdir -p`). An already existing directory
is fine (safe to call in parallel), but a path that exists as a regular file rejects with `EEXIST`.
Unlike the native call, resolves with `pathname` itself — handy for chaining.

```js
await fs_mkdirp('/tmp/a/b/c');    // '/tmp/a/b/c'
```
