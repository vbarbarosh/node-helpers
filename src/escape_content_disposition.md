Escapes a value (typically a filename) for use in a `Content-Disposition`
header. A pure RFC 7230 token (letters, digits, `!#$%&'*+.^_`|~-`) is returned
as-is; anything else — spaces, `;`, `,`, quotes, etc. — becomes a quoted-string
with `\` `"` `%` backslash-escaped and `\n`/`\0` encoded as `%x0A`/`%x00`.
An unquoted `a"b` or `a,b` would break header parsing.

```js
escape_content_disposition('report.pdf')  // 'report.pdf'
escape_content_disposition('foo bar.txt') // '"foo bar.txt"'
escape_content_disposition('foo"bar')     // '"foo\\"bar"'
escape_content_disposition('foo\nbar')    // '"foo%x0Abar"'
escape_content_disposition('')            // '""'
```
