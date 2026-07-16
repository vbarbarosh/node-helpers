Splits a URL into a fixed-shape plain object. Accepts a `URL` instance or a
string; strings are parsed against the base `fake://fake/`, so relative paths
work (and non-string input degrades to the bare base instead of throwing).
The keys mirror the `URL` properties, except `pathname` is exposed as `path`.

```js
urlparts('https://john:secret@example.com:8080/users/15?page=2#top')
// {
//     href: 'https://john:secret@example.com:8080/users/15?page=2#top',
//     protocol: 'https:', hostname: 'example.com',
//     username: 'john', password: 'secret',
//     host: 'example.com:8080', port: '8080',
//     path: '/users/15', search: '?page=2', hash: '#top',
// }
urlparts('/users?page=5').path      // '/users'
urlparts('/users?page=5').protocol  // 'fake:'
```
