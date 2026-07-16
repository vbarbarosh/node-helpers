Worker poll loop over redis queues that delegates the actual work to an
external executable. Repeatedly `redis_zshift`s one message from
`redis_input_queue`, JSON-parses it, dumps it as `request.json` into a fresh
temp directory, and spawns `spawn_command` with that directory as `cwd`. On
exit code 0 it rpushes `{uid, version, type: 'resolve', value: null}` to
`redis_output_queue`; any failure rpushes `type: 'error'` with the stack.
An empty poll sleeps a random 500–1500ms; the loop runs at most 86400
iterations.

- The child gets an extra pipe on fd 3: each line written there is rpushed as
  a `{uid, version, type: 'user_friendly_status', value}` message; a generic
  `'Started...'` status is always pushed first. stdout/stderr are logged
  line by line under the `log_worker_stdout`/`log_worker_stderr` tags.
- Only exit code 0 is a success — a signal-killed child (code `null`) fails.
- Unparseable messages and messages without `uid` are skipped; a missing or
  past `expires_at` fails the message (payloads carry signed urls with
  limited lifetime).
- `options.log` must provide `spawn()`; the redis client must provide
  `rpush_p`. See `redis_poll_zshift_callback_rpush` for the in-process
  callback variant (which reports failures as `type: 'reject'`).
