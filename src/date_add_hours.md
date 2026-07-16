Adds `hours` hours to a `Date` via `setHours`. **Mutates the passed `Date` in
place and returns the same instance** — clone first if the original must be
preserved. Negative values subtract; overflow rolls over into the next
day/month/year.

```js
date_add_hours(new Date('2026/07/06 23:30:00'), 2)    // 2026/07/07 01:30:00 (same Date object)
```
