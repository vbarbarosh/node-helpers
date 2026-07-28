Asserts that `value` is a finite integer greater than or equal to `1`.
The optional `name` is included in the error message.

```js
assert_positive_integer(3, 'concurrency')   // returns undefined
assert_positive_integer(0, 'concurrency')   // throws Error
assert_positive_integer(1.5, 'concurrency') // throws Error
```
