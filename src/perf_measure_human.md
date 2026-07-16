Runs `fn` (sync or async — the result is awaited) and returns a promise of
just the elapsed time as a human-readable seconds string:
`perf_measure_human(fn, digits = 4)`. The return value of `fn` is discarded;
use `perf_measure` when you need it too.

```js
await perf_measure_human(() => heavy_work())    // '0.0006s'
```
