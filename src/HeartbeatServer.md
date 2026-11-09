Watchdog for worker processes. Listens on a unix domain socket and expects
regular pings (see `ping_socket`); the internal promise rejects when no valid
ping arrives within `interval_ms` (default 5000). Only the lack of a valid
PING within the interval is fatal — everything else (client errors, floods)
merely emits a `warning` event.

**Socket:** placed on `/dev/shm` when available (tmpfs, avoids slow disks),
otherwise `os.tmpdir()`, in a directory of its own with mode `0700`; the
socket itself gets mode `0600`. Only the user who runs the server can reach
it, and the path is unique per instance.

**A ping** is a connection that sends exactly `PING` (a trailing newline is
allowed, so `echo PING` works) and ends cleanly, as `ping_socket` does. The
server replies `OK` to every connection. An empty connection, a partial frame,
extra bytes or another word is not a heartbeat: it emits a `warning` and does
not refresh the deadline. A client that sends more than 64 bytes is destroyed
with a `warning`, and one that stays silent for a whole interval is dropped.
Up to v3.79.2 any connection that ended cleanly counted.

**promise():** rejects with `ExitCodeError` (`exit_code = 124`,
`No heartbeat...`) when the watchdog fires — the instance then disposes
itself, so no `heartbeat` events follow. Rejects with `Server Failed: ...`
if the socket cannot listen. Never resolves.

**dispose():** stops the timer, closes the server, removes the socket file,
and rejects the internal promise with a `Server Closed` error. Idempotent —
safe to call before listening completed, after a failed listen, and twice.

**Events:** `heartbeat` (a ping was received), `warning` (non-fatal error).

```js
const server = new HeartbeatServer(5000);
try {
    worker.send({watchdog_socket: server.socket_path});
    await server.promise(); // rejects on missing heartbeat or dispose()
}
finally {
    await server.dispose();
}
```
