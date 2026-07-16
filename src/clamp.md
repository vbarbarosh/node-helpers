Clamps `value` into the `[min, max]` range. Note the argument order:
`clamp(min, max, value)`, the value comes last.

```js
clamp(0, 10, 15)    // 10
clamp(0, 10, -1)    // 0
clamp(0, 10, 5)     // 5
clamp(5, 5, 7)      // 5 (degenerate range)
```
