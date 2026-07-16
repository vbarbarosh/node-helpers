Runs `fn` (sync or async — the result is awaited) and measures how long it
took with `process.hrtime`. `perf_measure(fn, digits = 4)` returns a promise
of `{value, time_ms, time_human}` where `value` is the resolved result of
`fn`, `time_ms` is rounded integer milliseconds, and `time_human` is a
seconds string with `digits` decimal places.

```js
await perf_measure(() => 42)
// {value: 42, time_ms: 1, time_human: '0.0008s'}
```
