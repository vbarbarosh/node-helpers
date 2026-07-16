Strict binary string comparison via the plain `<`/`>` operators — UTF-16
code-unit order, like MySQL's `utf8_bin` collation. Case-sensitive, all
uppercase ASCII sorts before lowercase, no numeric awareness
(`'file10' < 'file2'`). No `Intl`/ICU is involved — the order is identical
on every machine, unlike the other `fcmp_utf8_*` comparators.

```js
['b', 'A', 'a', 'B'].sort(fcmp_utf8_bin)    // 'A' 'B' 'a' 'b'
['file10', 'file2'].sort(fcmp_utf8_bin)     // 'file10' 'file2'
```

For deterministic natural order (`'file2' < 'file10'`) use
`fcmp_utf8_natural_bin` (the string order behind `fcmp_default`/`fcmpx`);
for locale-aware ordering use `fcmp_utf8_cs`/`_ci`.
