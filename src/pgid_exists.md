Checks whether a process group is alive by sending signal `0` to the group via
`process.kill(-pgid, 0)`. Returns `true` when the signal can be delivered to
at least one member, `false` on any error (no such group, or no permission).
A group id equals the pid of the group leader.

See `pid_exists` for the single-process variant.
