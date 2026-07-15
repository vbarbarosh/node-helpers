Natural string comparison without locale: digit chunks — ASCII `[0-9]` only,
Unicode digits are treated as plain text — compare numerically (`'2' < '10'`,
`'file2' < 'file10'`), everything else compares in UTF-16 code-unit order
(uppercase before lowercase). Deterministic on every machine — no `Intl`/ICU.
Accepts strings only, like the rest of the `fcmp_utf8_*` family; `fcmp_default`
handles other types before delegating string pairs here.
This is the string order behind `fcmp_default`; see `fcmp_default.md` for
caveats. For locale-aware natural order use `fcmp_utf8_natural_cs`/`_ci`.
