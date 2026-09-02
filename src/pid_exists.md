Checks whether a process is alive by sending signal `0` via
`process.kill(pid, 0)`. Returns `true` when the signal can be delivered,
`false` on any error (no such process, or no permission to signal it).

Throws `TypeError` when `pid` is not an integer greater than `1`: `0` would
probe the caller's own process group and `-1` every process the user may
signal, so such values never reach `kill(2)`.

See `pgid_exists` for the process-group variant.
