Parses an absolute or relative URL-like string into a stable object shape.
Missing scalar components are `null`. `search` and `hash` preserve their
delimiters, while `query` and `fragment` are always parsed plain objects.

Malformed URL text is accepted and parsed on a best-effort basis. A non-string
argument returns the empty stable shape instead of throwing.

```js
urlparts('/users?a=1#top')
// {
//     protocol: null,
//     username: null,
//     password: null,
//     host: null,
//     port: null,
//     path: '/users',
//     search: '?a=1',
//     hash: '#top',
//     query: {a: '1'},
//     fragment: {top: ''},
// }

urlparts('https://john:secret@example.com:8080/users?page=2')
// {
//     protocol: 'https',
//     username: 'john',
//     password: 'secret',
//     host: 'example.com',
//     port: '8080',
//     path: '/users',
//     search: '?page=2',
//     hash: null,
//     query: {page: '2'},
//     fragment: {},
// }
```

Duplicate query or fragment parameters use the last value. Parameter values
without `=` are normalized to `''`, matching explicitly empty values. Missing
`search` and `hash` values are `null`; present-but-empty delimiters are `'?'`
and `'#'`. Their parsed `query` and `fragment` objects remain `{}` when empty or
absent. Special parameter names such as `__proto__` are preserved as ordinary
own properties without changing the object prototype. An empty path is `null`.
