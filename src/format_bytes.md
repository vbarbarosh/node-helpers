Formats a byte count as a human-readable size using base-1024 math with
`B`/`KB`/`MB`/`GB`/`TB`/`PB` suffixes.

- Non-number or `NaN` input returns `'n/a'`.
- `0` returns `'0KB'`; any other value below 1024 returns `'1KB'` — sizes are
  never shown in bytes or fractions of a KB.
- Values up to 1 MB are rounded to a whole number; above 1 MB two decimals are
  kept, with a trailing `.00` collapsed to `.0`.

```js
format_bytes(500)              // '1KB'
format_bytes(2048)             // '2KB'
format_bytes(2*1024*1024)      // '2.0MB'
format_bytes(35.45*1024*1024)  // '35.45MB'
```
