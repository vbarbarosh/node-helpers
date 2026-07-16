Estimates the remaining time of a progress loop and formats it as `HH:MM:SS`
(via `format_seconds`). The rate is derived from what was processed since
`time0`; pass `resumed` to exclude units that were already done at start (e.g.
a resumed download), so they don't inflate the rate.

## Signature

```
eta(time0, total, done, resumed = 0) → string
```

`time0` is a `Date.now()`-style start timestamp in milliseconds. When no
progress was made yet (rate is zero), returns the placeholder `'--:--:--'`.

```js
eta(Date.now() - 10000, 100, 50)    // '00:00:10'
eta(Date.now(), 100, 0)             // '--:--:--'
```
