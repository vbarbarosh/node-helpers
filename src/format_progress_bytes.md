Formats a `make_progress` snapshot (`{percents, total, done, rate, eta, duration}`)
as a one-line byte-progress string, using 1024-based units (`format_bytes`).
Unknown parts (zero/null rate, eta, total) render as `~`; the layout degrades
as less is known: full form → `done of ~` (no total) → `~ duration=…`
(nothing done) → `~`. When `done > total`, the percents/total part is
dropped entirely.

```js
format_progress_bytes({percents: 0.2525, total: 15*1024*1024, done: 5*1024*1024, rate: 10*1024*1024, eta: 5, duration: 1})
// '25.25% | 5.0MB of 15.0MB at 10.0MB/s ETA 00:00:05 duration=00:00:01'
format_progress_bytes({percents: 0, total: 0, done: 0, rate: 0, eta: 0, duration: 0})
// '~'
```
