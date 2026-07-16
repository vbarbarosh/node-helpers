Formats a number in metric (base-1000) notation with `K`/`M`/`G`/`T`/`P`
suffixes.

- Non-number or `NaN` input returns `'n/a'`.
- `0` returns `'0'`; values below 1000 are rounded to a whole number, no
  suffix.
- Values of 1000 and above always keep two decimals.

```js
format_kilo(55.55)      // '56'
format_kilo(1500)       // '1.50K'
format_kilo(35.45e6)    // '35.45M'
```
