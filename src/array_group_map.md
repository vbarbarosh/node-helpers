Groups items by the key returned from `read(item)` and returns a plain object
mapping each key to a `{key, items}` group. Keys are used as object properties,
so they are coerced to strings.

```js
array_group_map([{t: 'a', v: 1}, {t: 'b', v: 2}, {t: 'a', v: 3}], x => x.t)
// {
//     a: {key: 'a', items: [{t: 'a', v: 1}, {t: 'a', v: 3}]},
//     b: {key: 'b', items: [{t: 'b', v: 2}]},
// }
```

See `array_group` for the same grouping returned as an array of groups.
