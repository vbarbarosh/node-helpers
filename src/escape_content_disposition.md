Escapes a value (typically a filename) for use in a `Content-Disposition`
header. A pure RFC 7230 token (letters, digits, `!#$%&'*+.^_`|~-`) is returned
as-is; anything else — spaces, `;`, `,`, quotes, etc. — becomes a quoted-string
with `\` `"` `%` backslash-escaped, every control character (`\0`-`\x1f`,
`\x7f`, so `\n`, `\r`, `\x01`...) encoded as `%xHH`, and any character above
U+00FF (not representable in ISO-8859-1) replaced with `?`. The result is
always a valid header value. An unquoted `a"b` or `a,b` would break header
parsing.

See `escape_content_disposition_utf8` for the RFC 5987 `filename*` form that
carries a non-ASCII name alongside the `?`-degraded `filename` fallback.

```js
escape_content_disposition('report.pdf')  // 'report.pdf'
escape_content_disposition('foo bar.txt') // '"foo bar.txt"'
escape_content_disposition('foo"bar')     // '"foo\\"bar"'
escape_content_disposition('foo\nbar')    // '"foo%x0Abar"'
escape_content_disposition('foo\rbar')    // '"foo%x0Dbar"'
escape_content_disposition('файл.txt')    // '"????.txt"'
escape_content_disposition('')            // '""'
```
