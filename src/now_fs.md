Returns the current local time as a filesystem-safe timestamp:
`YYYYMMDD_HHMMSS` (via `format_date_fs`). Resolution is 1 second — handy for
naming files, dumps, and backups.

```js
now_fs()    // '20260716_194122'
```
