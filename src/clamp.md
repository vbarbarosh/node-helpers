Clamps `value` into the `[min, max]` range. Note the argument order:
`clamp(min, max, value)`, the value comes last.

```js
clamp(0, 10, 15)    // 10
clamp(0, 10, -1)    // 0
clamp(0, 10, 5)     // 5
clamp(5, 5, 7)      // 5 (degenerate range)
```

**Why min and max come first.** In most calls `min` and `max` are short
constants, while `value` is often a long expression. Put first, the bounds
stay compact at the start of the call and are read at a glance; the long
value follows them. Put last, they would get lost behind the value:

```js
// the bounds first: 0 and 100 are seen at once
const percent = clamp(0, 100, Math.round((event.clientX - rect.left) / rect.width * 100));

// were they last, they would trail behind the value, easy to miss:
// const percent = clamp(Math.round((event.clientX - rect.left) / rect.width * 100), 0, 100);
```
