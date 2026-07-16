Comparator builder using compact expressions: creates an `fcmp` function
suitable for `[].sort()`. Values compare with `fcmp_default` (natural order —
see `fcmp_default.md`) unless a custom `fcmp` is given.

**Expression forms** (composable — an array mixes any of them as sort keys,
first key wins, later keys break ties):

```js
fcmpx('user.email')                       // dotted property path
fcmpx('-user.age')                        // '-' prefix → descending
fcmpx('-user.age,user.email')             // comma → multiple keys
fcmpx(v => v.user.email)                  // read function
fcmpx('')                                 // '' or '.' → the item itself
fcmpx(['-age', 'name'])                   // array of keys
fcmpx({read: 'v', fcmp: (a, b) => b - a}) // object form: custom comparator
fcmpx({read: 'type', top: ['dir']})       // listed values first, in listed order
fcmpx({read: 'type', bottom: ['tmp']})    // listed values last
fcmpx({read: 'age', desc: true})          // descending via object form
```

```js
users.sort(fcmpx('-age,name'));
// age 35 first, ties by name; {name: 'bob'} (no age) goes last

files.sort(fcmpx([{read: 'type', top: ['dir', 'file']}, 'name']));
// dirs, then files, then everything else — each group sorted by name
```

**Missing values:** `null`/`undefined` (and dead-end paths) are considered
greater than any defined value, so they always land after all defined values —
even in descending order.

- YouTube: [Сортировка объектов в JavaScript](https://www.youtube.com/watch?v=rHEH_JfQjL4)
- https://github.com/vbarbarosh/speaking/tree/master/20250822-js-sort-fcmpx
