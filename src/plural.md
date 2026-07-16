Slavic-style pluralizer: `plural(n, singular, plural, zero)`. The `singular`
form is used when `n` ends in 1 but not in 11 (1, 21, 101, ...); everything
else gets the `plural` form. Every `#` in the chosen form is replaced with
`n`. The optional `zero` string is returned as-is when `n === 0`.

```js
plural(1, '# apple', '# apples')                // '1 apple'
plural(2, '# apple', '# apples')                // '2 apples'
plural(11, '# apple', '# apples')               // '11 apples'
plural(21, '# apple', '# apples')               // '21 apple'
plural(0, '# apple', '# apples')                // '0 apples'
plural(0, '# apple', '# apples', 'No apples')   // 'No apples'
```
