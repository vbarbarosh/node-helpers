Formats a `make_progress` snapshot (`{percents, total, done, rate, eta, duration}`)
as a one-line progress string using metric 1000-based units (`format_kilo`) —
for counting items, jobs, rows, etc. Identical layout and degradation rules
to `format_progress_bytes`: unknown parts render as `~`, and when
`done > total` the percents/total part is dropped.

```js
format_progress_kilo({percents: 0.2525, total: 15e6, done: 5e6, rate: 10e6, eta: 5, duration: 1})
// '25.25% | 5.00M of 15.00M at 10.00M/s ETA 00:00:05 duration=00:00:01'
```
