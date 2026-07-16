Adds `months` calendar months to a `Date`. **Mutates the passed `Date` in
place and returns the same instance** (a falsy `months`, e.g. `0`, is a no-op).
Negative values subtract.

Unlike a bare `setMonth`, the day of month never overflows into the next
month: when the target month is shorter, the date is clamped to its last day
(Carbon-style behavior).

```js
date_add_months(new Date('2023/01/31'), 1)     // 2023/02/28, not 2023/03/03
date_add_months(new Date('2019/03/31'), -1)    // 2019/02/28
date_add_months(new Date('2024/02/29'), 12)    // 2025/02/28
```
