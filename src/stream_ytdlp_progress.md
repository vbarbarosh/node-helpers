Transform that parses yt-dlp `--progress` output (stdout) into objects:
`{current_part, total_parts, perc, done, total, speed, eta, merging}`. Sizes
are re-formatted via `parse_bytes`/`format_bytes` (`15.71MiB` → `'15.71MB'`,
`done` computed from the percentage), `Unknown` speed/ETA become `'~'`, and
non-progress lines are dropped.

- `[info] ...: Downloading N format(s): 251+248` plus the per-part
  `[download] Destination: ....fNNN.ext` lines drive
  `current_part`/`total_parts` for multi-format downloads (otherwise
  `1`/`0`).
- A `[Merger]` line re-emits the last row with `merging: true`. The last row
  is mutated in place, so copy rows if you collect them.

```js
stream.Readable.from(lines).pipe(stream_ytdlp_progress())
// {current_part: 1, total_parts: 0, perc: '50.90%', done: '8.0MB',
//  total: '15.71MB', speed: '33.83MB/s', eta: '00:01', merging: false}
```
