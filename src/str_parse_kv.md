Splits a `key: value` string on the first colon and returns a trimmed
`[key, value]` pair. Only the first colon splits — the rest stays in the
value — so URLs survive. Without a colon, the whole string is the key and
the value is `''`.

```js
str_parse_kv('key: value')                  // ['key', 'value']
str_parse_kv('url: http://example.com')     // ['url', 'http://example.com']
str_parse_kv('key')                         // ['key', '']
str_parse_kv(':value')                      // ['', 'value']
```
