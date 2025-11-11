Generates a sequence of numbers.

This function is a small, predictable replacement for Python-style `range()`.
It produces an **array** of values forming an arithmetic progression.

---

## **Usage**

```js
range(stop)
range(start, stop)
range(start, stop, step)
```

| Form                       | Meaning                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `range(stop)`              | Generates numbers from `0` up to `stop` (exclusive).                            |
| `range(start, stop)`       | Generates numbers from `start` up to `stop` (exclusive), step = `+1`.           |
| `range(start, stop, step)` | Generates numbers from `start` up to `stop` (exclusive), incremented by `step`. |

---

## **Semantics**

* The **stop** value is **exclusive**.
* If `step > 0`, the sequence continues while `value < stop`.
* If `step < 0`, the sequence continues while `value > stop`.
* If the **direction implied by step does not match the range**, the result is an empty array:

  ```js
  range(5, 3)        // []
  range(3, 10, -1)   // []
  ```
* `step = 0` is treated as **no progression**, returning an empty array.

---

## **Examples**

```js
range(5)
// → [0, 1, 2, 3, 4]

range(2, 6)
// → [2, 3, 4, 5]

range(2, 10, 2)
// → [2, 4, 6, 8]

range(10, 3, -2)
// → [10, 8, 6, 4]

range(3, 3)
// → []

range(5, 3)
// → []   (step defaults to +1, so direction is invalid)
```

---

## **Edge Behavior**

| Call              | Result   | Notes                                   |
|-------------------|----------|-----------------------------------------|
| `range(5, 5)`     | `[]`     | Empty range                             |
| `range(5, 3)`     | `[]`     | Cannot count upward when `start > stop` |
| `range(5, 3, -1)` | `[5, 4]` | Negative step allows descending         |
| `range(3, 10, 0)` | `[]`     | Zero step produces no progression       |

---

## **Return Value**

Returns an **array** of numbers.

A safety limit (`limit = 1e6` internally) prevents runaway loops.
