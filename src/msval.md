Converts hours, minutes, seconds, and milliseconds to a single millisecond
value: `msval(h, m, s, ms)` → `h*3600000 + m*60000 + s*1000 + ms`. All four
arguments are required. Components are not normalized — `msval(0, 90, 0, 0)`
is fine — and negative components subtract.

```js
msval(1, 30, 15, 500)   // 5415500
msval(0, 90, 0, 0)      // 5400000
msval(1, 0, 0, -1)      // 3599999
```
