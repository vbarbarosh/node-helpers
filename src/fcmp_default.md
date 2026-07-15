Compares two values for sorting. Numbers, dates, and bigints compare via
`<`/`>`. Strings compare in natural order: digit chunks — ASCII `[0-9]` only,
Unicode digits are treated as plain text — compare numerically, all other
characters compare in UTF-16 code-unit order, exactly like the plain `<`/`>`
operators. No `Intl`/ICU is involved — the order is identical on every machine.

```js
[999, 22, 15, 10, 3, 2, 1].sort(fcmp_default)       // 1 2 3 10 15 22 999
['10', '2', '1'].sort(fcmp_default)                 // '1' '2' '10'
['ccc', 'aaa', 'CCC', 'AAA'].sort(fcmp_default)     // 'AAA' 'CCC' 'aaa' 'ccc'
['readme.md', 'README.md'].sort(fcmp_default)       // 'README.md' 'readme.md'
['a10', 'a2', 'A20', 'A3'].sort(fcmp_default)       // 'A3' 'A20' 'a2' 'a10'
```

This is the default comparator behind `array_sort`, `array_sort_other`,
`fcmp_tuples`, and `fcmpx`; `fcmp_default_desc` is its descending mirror. For
strict UTF-16 code-unit ordering of digit-bearing strings use `fcmp_utf8_bin`;
for locale-aware ordering use the `fcmp_utf8_*` family.

Caveats:

- Equal digit values with different padding order by padding: `'2' < '02'`
  (fewer leading zeros first). They never compare equal, so the order is
  total and stable.
- Mixed types (number vs string) are not a total order; sorting a
  heterogeneous array gives unspecified order between types.

Changed in v3.76: digit chunks used to compare by code units, which put
`'10'` before `'2'`.
