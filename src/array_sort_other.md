Sorts `array` in place so that items whose `read(item)` value appears in
`other` come first, in the same order as in `other`. Items not found in
`other` go to the end, ordered by `fcmp(a, b)` — note the fallback compares
the items themselves, not their `read` keys (default `fcmp_default`).

Lookup keys are coerced to object property strings; a null-prototype map is
used internally, so values like `'constructor'` or `'__proto__'` are safe.

```js
array_sort_other([1, 2, 3, 4, 5], v => v, [5])    // [5, 1, 2, 3, 4]
```
