Terminates a single process gracefully: sends `SIGTERM`, polls (every ≤100ms)
until the process dies or the grace period expires, then sends `SIGKILL` and
waits up to 200ms more for the kernel to deliver it.

- Options: `grace_timeout_ms` (default `5000`) and `log` (progress callback,
  default no-op).
- Throws `Failed to send SIGTERM to process <pid>: ...` when the initial
  signal cannot be sent (e.g. the process does not exist).
- A process that dies on its own during the grace period skips the `SIGKILL`
  entirely; `ESRCH` on the `SIGKILL` itself is treated as already dead.
- Throws `Process <pid> survived SIGKILL` if it is still alive 200ms after
  the kill.

See `pgid_kill_grace` for the process-group variant.
