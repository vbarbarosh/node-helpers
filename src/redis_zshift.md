Atomically pops up to `limit` (default `1`) lowest-scored members from a redis
sorted set: a `MULTI` transaction of `ZRANGE queue 0 limit-1` plus
`ZREMRANGEBYRANK queue 0 limit-1`. Returns the array of popped members —
empty when the set is empty.

Works with both legacy callback clients (redis@1–3, detected by the presence
of a lowercase `zrange` method) and promise clients (redis@4–6); the tests run
against all six major versions.

## Signature

```
redis_zshift(redis, queue, limit = 1) → Promise<string[]>
```
