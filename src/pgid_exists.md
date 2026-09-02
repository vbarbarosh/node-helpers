Checks whether a process group is alive by sending signal `0` to the group via
`process.kill(-pgid, 0)`. Returns `true` when the signal can be delivered to
at least one member, `false` on any error (no such group, or no permission).
A group id equals the pid of the group leader.

Throws `TypeError` when `pgid` is not an integer greater than `1`: `0` would
probe the caller's own process group and `1` every process the user may
signal (`kill(-1, ...)`), so such values never reach `kill(2)`.

See `pid_exists` for the single-process variant.
