Terminates a whole process group gracefully: sends `SIGTERM` to the group
(`kill(-pgid, ...)`), polls (every ≤100ms) until the group dies or the grace
period expires, then sends `SIGKILL` and waits up to 200ms more for the kernel
to deliver it. A group id equals the pid of the group leader.

- Options: `grace_timeout_ms` (default `5000`) and `log` (progress callback,
  default no-op).
- Throws `Failed to send SIGTERM to process group <pgid>: ...` when the
  initial signal cannot be sent.
- A group that dies on its own during the grace period skips the `SIGKILL`;
  `ESRCH` on the `SIGKILL` itself is treated as already dead.
- Throws `Process group <pgid> survived SIGKILL` if it is still alive 200ms
  after the kill.

See `pid_kill_grace` for the single-process variant.
