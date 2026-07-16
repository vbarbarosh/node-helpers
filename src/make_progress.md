Creates a progress tracker for any countable work (bytes copied, jobs done,
rows created). Pass the snapshot to `format_progress_bytes` /
`format_progress_kilo` for display.

**Fields:** `done`, `total`, `duration` (seconds since creation), `rate`
(units/second over a sliding 10-second history window), `eta` (seconds),
`percents` (a fraction, `done/total`). `rate` and `eta` are `null` while
unknown — before the first `add`, or when they would be `Infinity` (zero
time window, zero rate); `percents` is `null` when `total` is falsy.

**Methods:**
- `add(delta)` — add `delta` to `done` and recompute
- `update(done)` — set the absolute `done` value
- `refresh()` — recompute `duration`/`rate`/`eta`/`percents` without adding

```js
const p = make_progress(100);
p.add(10);          // p.done → 10, p.percents → 0.1
p.rate; p.eta;      // numbers once enough history exists, null while unknown
```
