Returns all permutations of the array. With the optional `k`, returns all
ordered arrangements of `k` elements instead. The input array is never mutated.

**Order:** full permutations come out in Heap's-algorithm order, not
lexicographic; `k`-arrangements come out grouped by the first element in input
order.

**Edge cases:** `k = 0` gives `[[]]`; `k` larger than the array length gives `[]`.

```js
array_permutations([1, 2, 3])       // [[1,2,3], [2,1,3], [3,1,2], [1,3,2], [2,3,1], [3,2,1]]
array_permutations([1, 2, 3], 2)    // [[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]]
```
