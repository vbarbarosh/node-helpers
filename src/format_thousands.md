Formats a number with commas as thousands separators. Works on the value's
`toString()` output: only the integer part is grouped, fractional digits are
left untouched, and negative numbers are handled.

```js
format_thousands(1234567)            // '1,234,567'
format_thousands(-1000)              // '-1,000'
format_thousands(123456789.01234)    // '123,456,789.01234'
```
