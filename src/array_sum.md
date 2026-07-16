Sums `read(item)` over the array. `read` defaults to `Number`, so string
items are cast. An empty array sums to `0`.

```js
array_sum([1, 2, 3, 4, 5])              // 15
array_sum(['1', '2', '3'])              // 6
array_sum([{n: 1}, {n: 2}], v => v.n)   // 3
```
