Returns the time elapsed since `perf_start()` as a human-readable string of
seconds: `perf_end_human(time0, digits = 4)`. Uses `process.hrtime(time0)`
under the hood, formatted via `format_hrtime`.

```js
const time0 = perf_start();
// ... work ...
perf_end_human(time0)       // '0.0008s'
perf_end_human(time0, 2)    // '0.00s'
```
