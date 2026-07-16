Compares two numbers for sorting, ascending, via plain subtraction (`a - b`).
Useful because the default `[].sort()` compares numbers as strings.

```js
[10, 9, 1, 100, 2].sort()               // 1 10 100 2 9 (default sort is lexicographic)
[10, 9, 1, 100, 2].sort(fcmp_numbers)   // 1 2 9 10 100
```

Incomparable pairs (`NaN` vs anything, `Infinity` vs `Infinity`) return `NaN`,
not `0`. For mixed types use `fcmp_default`, which also sorts numbers
ascending and handles `NaN` by returning `0`.
