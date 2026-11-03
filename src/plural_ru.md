Russian pluralizer: `plural_ru(n, one, few, many, zero)`. A counted word in
Russian has three forms, and `n` picks one: `one` when it ends in 1 but not in
11 (1, 21, 101), `few` when it ends in 2, 3 or 4 but not in 12, 13 or 14 (2, 23,
104), `many` otherwise (0, 5, 11, 19, 100). A fraction takes the `few` form
(1.5 яблока). Every `#` in the chosen form is replaced with `n`. The optional
`zero` string is returned as-is when `n === 0`. A form without `#` comes back
as it is, so the helper also picks a case: `switch (plural_ru(n, '1', '2', '5', '0'))`.
English words have two forms: see `plural`.

```js
plural_ru(1, '# яблоко', '# яблока', '# яблок')               // '1 яблоко'
plural_ru(2, '# яблоко', '# яблока', '# яблок')               // '2 яблока'
plural_ru(5, '# яблоко', '# яблока', '# яблок')               // '5 яблок'
plural_ru(11, '# яблоко', '# яблока', '# яблок')              // '11 яблок'
plural_ru(21, '# яблоко', '# яблока', '# яблок')              // '21 яблоко'
plural_ru(22, '# яблоко', '# яблока', '# яблок')              // '22 яблока'
plural_ru(1.5, '# яблоко', '# яблока', '# яблок')             // '1.5 яблока'
plural_ru(0, '# яблоко', '# яблока', '# яблок')               // '0 яблок'
plural_ru(0, '# яблоко', '# яблока', '# яблок', 'Нет яблок')  // 'Нет яблок'
plural_ru(22, '1', '2', '5', '0')                             // '2'
```
