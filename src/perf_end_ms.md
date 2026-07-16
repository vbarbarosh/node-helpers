Returns the time elapsed since `perf_start()` in milliseconds, rounded to an
integer. Uses `process.hrtime(time0)` under the hood.

```js
const time0 = perf_start();
// ... work ...
perf_end_ms(time0)      // 1
```
