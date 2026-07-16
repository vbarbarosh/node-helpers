Fills missing keys of `obj` from `defaults`, mutating and returning `obj`.
Only keys whose current value is `undefined` (missing or explicitly set) are
filled; falsy values like `0`, `''`, `false`, and `null` are kept. The
`defaults` object is never modified.

```js
object_defaults({a: 1, b: undefined}, {a: 10, b: 20, c: 30})
// {a: 1, b: 20, c: 30}
object_defaults({a: 0, b: null}, {a: 5, b: 5})
// {a: 0, b: null}
```
