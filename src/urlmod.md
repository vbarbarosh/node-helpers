Set, change, or remove query string parameters.

Only the query string is parsed and rebuilt. The URL text before `?` and the
fragment starting with `#` are preserved, so absolute, relative,
protocol-relative, and non-standard URL-like strings are supported. Passing no
parameters, or an empty parameters object, returns the input unchanged.

`null` and `undefined` remove a parameter. Boolean values are encoded as `1`
and `0`; other values use the standard `URLSearchParams` conversion and
encoding rules. Special names such as `__proto__`, `constructor`, and
`hasOwnProperty` are handled as ordinary query parameter keys when provided as
enumerable own properties.

```js
urlmod('', {a: 1})                      // '?a=1'
urlmod('?a=1', {a: 2})                  // '?a=2'
urlmod('?a=1#top', {a: null})           // '#top'
urlmod('../api?old=1', {old: 2})        // '../api?old=2'
urlmod('//cdn.example/app.js', {v: 2})  // '//cdn.example/app.js?v=2'
urlmod('/search', {exact: true})        // '/search?exact=1'
```
