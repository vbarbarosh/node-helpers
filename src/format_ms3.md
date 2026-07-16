Formats a millisecond duration as `MM:SS.mmm` (full milliseconds), or
`HH:MM:SS.mmm` when there is a nonzero hours part. Sub-millisecond fractions
are truncated, not rounded. Pass `include_zero_hours = true` to force the
hours field even when it is zero. Falsy input formats as `0`; negative input
is factorized by magnitude and prefixed with `'-'`.

```js
format_ms3(5445)          // '00:05.445'
format_ms3(5445, true)    // '00:00:05.445'
format_ms3(1500.7)        // '00:01.500'
format_ms3(-3661500)      // '-01:01:01.500'
```
