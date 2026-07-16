Locale-aware, case-insensitive string comparison, like MySQL's `utf8_ci` /
`utf8mb4_ci` collations. Uses `localeCompare` with `{sensitivity: 'base'}`,
so both case and accents are ignored: `'a'` = `'A'`, `'é'` = `'e'`. No numeric
awareness (`'file10' < 'file2'`).

```js
['b', 'A', 'B', 'a'].sort(fcmp_utf8_ci)     // 'A' 'a' 'b' 'B' ([].sort is stable)
fcmp_utf8_ci('HELLO', 'hello')              // 0
```

Results depend on the runtime locale/ICU, unlike `fcmp_utf8_bin` and
`fcmp_utf8_natural_bin`, which are deterministic on every machine. For a
case-sensitive locale-aware order use `fcmp_utf8_cs`; for locale-aware natural
order use `fcmp_utf8_natural_ci`.
