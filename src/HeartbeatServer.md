Watchdog for worker processes. Listens on a unix domain socket and expects
regular pings (see `ping_socket`); the internal promise rejects when no valid
ping arrives within `interval_ms` (default 5000). Only the lack of a valid
PING within the interval is fatal — everything else (client errors, floods)
merely emits a `warning` event.

**Socket:** placed on `/dev/shm` when available (tmpfs, avoids slow disks),
otherwise `os.tmpdir()`. The path is unique per instance, even for instances
created within the same second. A ping is any connection that ends cleanly;
the server replies `OK` and ignores the payload (a client sending over 1 MiB
is destroyed with a `warning`).

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
