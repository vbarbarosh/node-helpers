Worker poll loop over redis queues: repeatedly `redis_zshift`s one message
from `redis_input_queue`, JSON-parses it, runs `options.callback({message,
log, user_friendly_status})`, and rpushes a JSON response `{uid, version,
type, value}` to `redis_output_queue` — `type: 'resolve'` with the callback's
return value, or `'reject'` with the error stack/message. An empty poll
sleeps a random 500–1500ms; the loop runs at most 86400 iterations.

- Unparseable messages and messages without `uid` are skipped; a missing or
  past `expires_at` rejects the message (payloads carry signed urls with
  limited lifetime).
- `user_friendly_status(value)` rpushes `{uid, version, type:
  'user_friendly_status', value}` to the output queue; a generic
  `'Started...'` status is always pushed first so the consumer starts
  refreshing.
- `options.log` must provide `spawn()`; the `log_waiter_*`/`log_worker_*`
  options are the tag names used in log lines. The redis client must provide
  `rpush_p`.
