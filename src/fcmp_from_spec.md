Creates a comparator from an array of property names; prefix a name with `-`
for descending order. Each property compares with `localeCompare` when both
values are strings (locale-dependent, no natural order), and with subtraction
otherwise.

```js
items.sort(fcmp_from_spec(['-price', 'name', 'id']));
// price desc, then name asc, then id asc
```

**Deprecated:** use `fcmpx` instead — it supports paths (`'user.email'`),
functions, natural string order via `fcmp_default`, and defined-before-missing
ordering.
