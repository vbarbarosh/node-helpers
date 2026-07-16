Atomically pops up to `limit` items (default `1`) from the head of a redis
list: a `MULTI` transaction of `LRANGE queue 0 limit-1` plus
`LTRIM queue limit -1`. Returns the array of popped items — empty when the
list is empty.

Works with both legacy callback clients (redis@1–3, detected by the presence
of a lowercase `lrange` method) and promise clients (redis@4–6); the tests run
against all six major versions.

## Signature

```
redis_lshift(redis, queue, limit = 1) → Promise<string[]>
```
