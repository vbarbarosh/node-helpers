Formats a millisecond duration as `MM:SS.cc` (centiseconds), or `HH:MM:SS.cc`
when there is a nonzero hours part. The value is rounded to the nearest
centisecond *before* factorizing, so the carry propagates through the larger
units. Falsy input formats as `0`; negative input is factorized by magnitude
and prefixed with `'-'`.

```js
format_ms2(5445)        // '00:05.45'
format_ms2(5999)        // '00:06.00' (rounding carries into seconds)
format_ms2(3599999)     // '01:00:00.00' (…and all the way up)
format_ms2(-3661500)    // '-01:01:01.50'
```
