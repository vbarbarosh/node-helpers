Locale-aware natural string comparison, case-sensitive: `localeCompare` with
`{numeric: true, sensitivity: 'variant'}`. Digit chunks compare as numbers
(`'file2' < 'file10'`), base letters dominate (`'apple2' < 'Banana1'`), and
case/accents distinguish otherwise equal strings.

```js
['a10', 'a2', 'A20', 'A3'].sort(fcmp_utf8_natural_cs)   // 'a2' 'A3' 'a10' 'A20'
```

Results depend on the runtime locale/ICU — the exact order of case variants
varies between machines. For deterministic natural order (uppercase before
lowercase, identical everywhere) use `fcmp_utf8_natural_bin`, the string order
behind `fcmp_default`/`fcmpx`. For ignoring case use `fcmp_utf8_natural_ci`.
