Checks whether a process is alive by sending signal `0` via
`process.kill(pid, 0)`. Returns `true` when the signal can be delivered,
`false` on any error (no such process, or no permission to signal it).

See `pgid_exists` for the process-group variant.
