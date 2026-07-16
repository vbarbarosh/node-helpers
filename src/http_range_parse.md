Parses an HTTP `Range` request header against a known resource size. Supports
`bytes=FIRST-LAST`, `bytes=FIRST-`, and `bytes=-LAST` (single range, `bytes`
unit only; spaces around `=` are allowed). Returns `{first, last}` with both
bounds inclusive.

Clamping follows RFC 7233:

- a suffix longer than the resource (`bytes=-5000` of 100) → the whole resource
- `last` past the end (`bytes=0-999999` of 100) → reads to the end

Throws for unparsable expressions and for unsatisfiable ranges: `first` past
the end (`bytes=100-` of 100), `first > last`, or an empty suffix (`bytes=-0`).

```js
http_range_parse('bytes=500-', 1000)   // {first: 500, last: 999}
http_range_parse('bytes=-100', 1000)   // {first: 900, last: 999}
http_range_parse('bytes=0-999999', 100) // {first: 0, last: 99}
```
