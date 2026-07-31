Creates a deferred: a bluebird promise with its own `resolve`, `reject`, and
node-style `callback(error, data)` attached, so it can be settled from outside
the executor. The optional `fn` receives `callback` immediately — handy for
wrapping callback-style APIs that take the callback as an argument.

## Signature

```
pending(fn = null) → Promise & {resolve, reject, callback}
```

## Examples

```
const promise = pending();
setTimeout(() => promise.resolve('done'), 100);
await promise;
```

```
await pending(callback => legacy_api(arg1, arg2, callback));
```
