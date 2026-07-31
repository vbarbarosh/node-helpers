Appends `value` to the tail of a redis list (`RPUSH`). Returns the new list
length.

Works with both legacy callback clients (redis@1–3, detected by the presence
of a lowercase `rpush` method) and promise clients (redis@4–6); the tests run
against all six major versions.

## Signature

```
redis_rpush(redis, queue, value) → Promise<number>
```
