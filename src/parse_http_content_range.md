Parses an HTTP `Content-Range` response header into
`{type, first, last, total}` (numbers, bounds inclusive).

- `bytes 0-499/1000` — a regular range.
- `bytes */5000` — unsatisfied range: `first` and `last` are `null`.
- `bytes 0-499/*` — unknown total: `total` is `null`.
- `bytes */*` throws — it is not in the RFC 7233 grammar: an unsatisfied
  range must state the complete length.

Throws for anything else it cannot parse.

```js
parse_http_content_range('bytes 0-499/1000') // {type: 'bytes', first: 0, last: 499, total: 1000}
parse_http_content_range('bytes */5000')     // {type: 'bytes', first: null, last: null, total: 5000}
parse_http_content_range('bytes 0-499/*')    // {type: 'bytes', first: 0, last: 499, total: null}
```
