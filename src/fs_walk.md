Walks a directory tree and resolves with a flat array of `lstat` results,
each with a `path` property added; the root entry is included. Order is not guaranteed.

**Options:** `fs_walk({path = '.', user_friendly_status, error_handler, signal})`
- `user_friendly_status(text)` — called with `Reading <path>` per entry
- `error_handler(error)` — per-entry errors are reported here and the walk continues (default logs to console)
- `signal` — an `AbortSignal` to cancel the walk

Symlinks are not followed (`lstat`), and the contents of `/dev` and `/proc` are skipped.

```js
await fs_walk({path: 'w'});
// [Stats {path: 'w', ...}, Stats {path: 'w/sub', ...}, Stats {path: 'w/a.txt', ...}, ...]
```
