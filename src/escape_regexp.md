Escapes regular-expression special characters (`. * + ? ^ $ { } ( ) | [ ] \`)
in a string with a backslash, so the string can be embedded literally in
`new RegExp(...)`.

```js
escape_regexp('a.b*c?')    // 'a\\.b\\*c\\?'
```
