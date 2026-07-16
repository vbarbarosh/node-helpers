Creates a minimal console logger. The returned function prints one line per
call via `console.log`: string messages are trimmed and JSON-escaped (without
the surrounding quotes), non-strings are printed as JSON. Leading `[tag]`
prefixes are split off and the whitespace between the tags and the message is
normalized to a single space.

```js
const log = logger();
log('hey');             // hey
log('[tag]   heyhey');  // [tag] heyhey
log({a: 1});            // {"a":1}
```

`log.spawn()` is a stub that throws `NotImplemented` — the `redis_poll_*`
helpers expect a logger whose `spawn()` returns a child logger.
