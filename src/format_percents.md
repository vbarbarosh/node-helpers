Formats a fraction (`0` to `1`) as a percentage with two decimal places. The
exact endpoints drop the decimals: `0` gives `'0%'` and `1` gives `'100%'`,
while everything in between keeps them (`'50.00%'`).

```js
format_percents(0)         // '0%'
format_percents(0.0101)    // '1.01%'
format_percents(0.5)       // '50.00%'
format_percents(1)         // '100%'
```
