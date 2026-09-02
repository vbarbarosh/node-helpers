Returns the RFC 5987 ext-value `UTF-8''<percent-encoded>` for a
`Content-Disposition` `filename*` parameter, so a non-ASCII filename can be
sent alongside the `?`-degraded `filename` fallback produced by
`escape_content_disposition`. Everything outside RFC 5987 attr-char is
percent-encoded, as jshttp/content-disposition does.

```js
escape_content_disposition_utf8('файл.txt')   // "UTF-8''%D1%84%D0%B0%D0%B9%D0%BB.txt"
escape_content_disposition_utf8('foo bar.txt') // "UTF-8''foo%20bar.txt"
// Content-Disposition: attachment; filename="????.txt"; filename*=UTF-8''%D1%84%D0%B0%D0%B9%D0%BB.txt
```
