Descending mirror of `fcmp_default`: it calls `fcmp_default` with the arguments
swapped, so everything in `fcmp_default.md` (natural string order, deterministic
no-`Intl` comparison, caveats) applies here in reverse.

```js
[1, 10, 2, 9].sort(fcmp_default_desc)                   // 10 9 2 1
['file1', 'file10', 'file2'].sort(fcmp_default_desc)    // 'file10' 'file2' 'file1'
```

For descending order by an object property use `fcmpx('-prop')` instead.
