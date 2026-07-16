Groups items by the key returned from `read(item)` and returns an array of
`{key, items}` groups, in the order each key was first seen. Keys are compared
with `Map` semantics, so any value type works as a key.

```js
array_group([{t: 'a', v: 1}, {t: 'b', v: 2}, {t: 'a', v: 3}], x => x.t)
// [
//     {key: 'a', items: [{t: 'a', v: 1}, {t: 'a', v: 3}]},
//     {key: 'b', items: [{t: 'b', v: 2}]},
// ]
```

Native alternative: `Map.groupBy(items, read)`. See `array_group_map` for the
same grouping returned as an object keyed by `key`.
