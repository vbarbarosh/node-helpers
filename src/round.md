Rounds `value` to the nearest multiple of `precision` (default `1`).
Precision can be fractional (`0.01`), coarse (`25`, `1000`), or a non-power
of 10 (`0.25`). A tiny signed epsilon fixes floating-point tie cases
(`1.005` at `0.01` correctly gives `1.01`, `-1.005` gives `-1.01`), and a
final `toFixed` cleanup strips artifacts like `34.038000000000004`.
`precision = 0` returns the value unchanged.

```js
round(2.7)                  // 3
round(34.037531, 0.001)     // 34.038
round(1.005, 0.01)          // 1.01
round(123.456, 10)          // 120
round(37.5, 25)             // 50
round(1.13, 0.25)           // 1.25
```
