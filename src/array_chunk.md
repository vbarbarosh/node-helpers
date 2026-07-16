Splits an array into consecutive chunks of at most `limit` items (default `1`).
The last chunk may be shorter. Throws if `limit` is less than 1.

```js
array_chunk([1, 2, 3, 4, 5], 2)    // [[1, 2], [3, 4], [5]]
array_chunk([1, 2, 3], 5)          // [[1, 2, 3]]
array_chunk([])                    // []
```
