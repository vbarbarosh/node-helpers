Locale-aware, case-sensitive string comparison, like MySQL's `utf8_cs` /
`utf8mb4_cs` collations but using the runtime locale. Uses `localeCompare`
with `{sensitivity: 'variant'}`: base letters dominate, so `'apple' < 'Banana'`
(unlike code-unit order), while case and accents still distinguish otherwise
equal strings. No numeric awareness.

```js
['cherry', 'Apple', 'banana'].sort(fcmp_utf8_cs)    // 'Apple' 'banana' 'cherry'
```

Results depend on the runtime locale/ICU — the exact order of case/accent
variants varies between machines; use `fcmp_utf8_bin` or
`fcmp_utf8_natural_bin` (the string order behind `fcmp_default`) for a
deterministic order. For ignoring case use `fcmp_utf8_ci`; for natural order
use `fcmp_utf8_natural_cs`.
