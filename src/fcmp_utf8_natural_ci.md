Locale-aware natural string comparison, case-insensitive: `localeCompare` with
`{numeric: true, sensitivity: 'base'}`. Digit chunks compare as numbers
(`'file2' < 'file10'`), and both case and accents are ignored
(`'file2'` = `'FILE2'`, `'é'` = `'e'`).

```js
['file10', 'FILE2', 'file1'].sort(fcmp_utf8_natural_ci)     // 'file1' 'FILE2' 'file10'
```

Results depend on the runtime locale/ICU — for natural order that is identical
on every machine use `fcmp_utf8_natural_bin` (the string order behind
`fcmp_default`/`fcmpx`). For a case-sensitive variant use
`fcmp_utf8_natural_cs`.
