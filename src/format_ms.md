Formats a millisecond duration as `MM:SS`, or `HH:MM:SS` when there is a
nonzero hours part (via `factorize_ms`). Fields are zero-padded to two digits;
the hours field grows as needed (`'999:00:00'`). Sub-second precision is
truncated, not rounded. Falsy input formats as `0`; negative input is
factorized by magnitude and prefixed with `'-'`.

```js
format_ms(5445)       // '00:05'
format_ms(1500.7)     // '00:01'
format_ms(3661000)    // '01:01:01'
format_ms(-61000)     // '-01:01'
```
