Compares two `Date` objects for sorting, ascending, by returning the difference
of their timestamps in milliseconds (`a.getTime() - b.getTime()`). Distinct
`Date` objects with the same timestamp compare equal. Throws if either argument
is not a `Date`.

```js
const input = ['2022-05-01', '1999-12-31', '2000-01-01'].map(v => new Date(v));
input.sort(fcmp_dates); // 1999-12-31, 2000-01-01, 2022-05-01
```

`fcmp_default` also orders `Date` objects (via `<`/`>`), so this is only needed
when a dedicated date comparator is clearer.
