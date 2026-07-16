Returns the type of a value as a string (see `const_type`). Like `typeof`,
but with the usual annoyances fixed: `null` is `'null'` (not `'object'`),
arrays are `'array'`, and the special numbers get their own names — `'nan'`,
`'-inf'`, `'+inf'`.

```js
gettype(null)       // 'null'
gettype([])         // 'array'
gettype(NaN)        // 'nan'
gettype(-Infinity)  // '-inf'
gettype(1n)         // 'bigint'
gettype({})         // 'object'
```
