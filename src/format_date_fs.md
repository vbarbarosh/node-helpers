Formats a `Date` as `YYYYMMDD_HHMMSS` in local time — no separators except the
underscore, so the result is safe to use in file names and sorts
chronologically.

```js
format_date_fs(new Date('2026/07/06 09:05:03'))    // '20260706_090503'
```
