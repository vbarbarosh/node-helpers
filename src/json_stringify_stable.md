Re-export of the [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify)
package: deterministic `JSON.stringify` — object keys are sorted at every
level, so equal objects always produce byte-identical output. Useful for
hashing, caching keys, and diff-friendly snapshots.

```js
json_stringify_stable({b: 2, a: 1, c: {z: 1, y: 2}})
// '{"a":1,"b":2,"c":{"y":2,"z":1}}'
```
