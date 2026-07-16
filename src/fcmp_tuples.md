Compares two arrays (tuples) lexicographically: items are compared pairwise
with `fcmp` (default `fcmp_default`) and the first non-zero result wins.

## Signature

```js
fcmp_tuples(a, b, fcmp = fcmp_default)
```

```js
[[2, 1], [1, 2], [1, 1]].sort(fcmp_tuples)  // [1,1] [1,2] [2,1]
fcmp_tuples([1], [1, 2])                    // 0 — length is not a tiebreaker
```

Only the first `Math.min(a.length, b.length)` items are compared: a shorter
tuple that is a prefix of a longer one compares as equal (unlike string
comparison, where `'a' < 'ab'`).
