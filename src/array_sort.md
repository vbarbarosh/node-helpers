Sorts an array in place by the key(s) that `mapper` returns for each item,
comparing with `fcmp` (default `fcmp_default`, natural order). The mapper may
return a scalar or a tuple; tuples compare element by element via
`fcmp_tuples`, so later elements break ties. Keys are cached, so the mapper
runs at most once per item. Returns the sorted array.

```js
array_sort([{id: 3}, {id: 1}, {id: 2}], v => v.id)    // sorted by id
array_sort(files, v => [v.type, v.name])              // by type, then by name
```

A common pattern for "these values first" is a priority index in the tuple:
`array_sort(items, v => [priorities.indexOf(v.type) >>> 0, v.name])`.
