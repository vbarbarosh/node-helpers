Splits a duration in milliseconds into `[hours, minutes, seconds, ms]`.
Hours are unbounded (no days component). The magnitude is factorized: negative
input gives the same result as its absolute value — the sign is the caller's
concern — and sub-millisecond fractions are truncated.

```js
factorize_ms(3723456)    // [1, 2, 3, 456]
factorize_ms(-1500.7)    // [0, 0, 1, 500]
factorize_ms(999)        // [0, 0, 0, 999]
```
