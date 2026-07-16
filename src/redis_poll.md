Generic worker poll loop with pluggable queue I/O: repeatedly calls
`options.poll_message()` for the next message object, runs `options.callback`
on it, and reports the result via `options.push_response({uid, version, type,
value})` with `type: 'resolve'` on success or `'reject'` (stack/message
string) on failure. An empty poll sleeps a random 500–1500ms; the loop runs
at most 86400 iterations.

- Messages without `uid` are skipped; a missing or past `expires_at` rejects
  the message (payloads carry signed urls with limited lifetime).
- The callback receives `{message, log, user_friendly_status}`;
  `user_friendly_status(value)` still rpushes
  `{uid, version, type: 'user_friendly_status', value}` JSON directly to
  `options.redis`/`options.redis_output_queue`, starting with `'Started...'`.
- `options.log` must provide `spawn()`; the many `log_waiter_*`/`log_worker_*`
  options are the tag names used in log lines.

See `redis_poll_zshift_callback_rpush` for the concrete zshift/rpush variant.
