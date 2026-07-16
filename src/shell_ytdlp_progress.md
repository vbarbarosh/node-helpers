Runs the `yt-dlp` binary (hardcoded name, resolved via `PATH`) with
`--progress` prepended to `args`, and turns its stdout progress lines into
user-friendly status lines. Each parsed row (see `stream_ytdlp_progress`)
is reported as `user_friendly_status('50.90% | [1/2] 8.0MB of 15.71MB at
33.83MB/s ETA 00:01 duration=31s')`; the merging stage reports
`'Merging... duration=...'`. `duration` is wall time since the spawn. stderr
lines are echoed to the console with a `[stderr]` prefix.

Rejects when the process exits with a non-zero code or is killed by a signal
(only exit code 0 is a success). Extra properties of the second argument are
passed through as spawn options.

## Signature

```
shell_ytdlp_progress(args, {user_friendly_status, ...options}) → Promise<void>
```
