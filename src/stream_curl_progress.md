Transform that parses curl's stderr progress meter (the `--progress-meter`
table) into objects. The two header lines are skipped; every following line
becomes `{perc, done, total, speed, eta, duration, time_total, ...}` with the
raw columns (`recv`, `transferred`, `speed_down`, `speed_up`, ...) included.
`done` is the received column, falling back to the transferred column while
received is `'0'` (uploads). `--:--:--` times are reported as `'~'`.

Lines starting with `curl:` (error messages) are written to
`process.stderr` and dropped from the output.

```js
stream.compose(proc.stderr, stream_curl_progress())
// {perc: '18', done: '587M', total: '3217M', speed: '19.0M', eta: '0:02:22', ...}
```
