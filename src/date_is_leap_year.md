Returns `true` if the `Date`'s year (local time, `getFullYear`) is a Gregorian
leap year: divisible by 4, except century years not divisible by 400. Verified
by brute force against `Date` itself for years 100–9998.

```js
date_is_leap_year(new Date('2024/01/01'))    // true
date_is_leap_year(new Date('1900/01/01'))    // false (century, not /400)
date_is_leap_year(new Date('2000/01/01'))    // true
```
