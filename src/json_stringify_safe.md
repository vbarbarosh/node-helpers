Re-export of the [json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe)
package: `JSON.stringify` that never throws on circular references — cycles
are replaced with `'[Circular ~]'`-style markers. Same signature as
`JSON.stringify(obj, replacer, spaces)` plus an optional 4th `cycleReplacer`.

```js
const a = {name: 'x'};
a.self = a;
json_stringify_safe(a)      // '{"name":"x","self":"[Circular ~]"}'
```
