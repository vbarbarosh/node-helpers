Asserts that `expires_at` is a `Date` object pointing to the future
(`getTime() > Date.now()`). Returns nothing on success; throws an `Error`
for anything else — past dates, the current instant, timestamps, date
strings, or non-`Date` values.

```js
assert_valid_expires_at(new Date(Date.now() + 60000))   // ok, returns undefined
assert_valid_expires_at(new Date(Date.now() - 1))       // throws Error
assert_valid_expires_at(Date.now() + 60000)             // throws Error (number, not Date)
```
