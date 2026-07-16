Starts a high-resolution timer: returns `process.hrtime()` — a
`[seconds, nanoseconds]` tuple to be passed later to `perf_end_ms` or
`perf_end_human`.

```js
const time0 = perf_start();
// ... work ...
perf_end_ms(time0)      // elapsed integer milliseconds
```
