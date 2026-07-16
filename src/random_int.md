Returns a random integer between `min` and `max`, both inclusive. Based on
`Math.random` — not cryptographically secure (use `random_hex` for tokens).

```js
random_int(1, 6)    // 1..6, like a die roll
random_int(-3, 3)   // -3..3
random_int(7, 7)    // 7
```
