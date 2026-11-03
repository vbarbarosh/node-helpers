English pluralizer: `plural(n, singular, plural, zero)`. The `singular` form is
used only when `n === 1`; every other `n` (0, 2, 11, 21, 101, ...) gets the
`plural` form. Every `#` in the chosen form is replaced with `n`. The optional
`zero` string is returned as-is when `n === 0`. A form without `#` comes back
as it is, so the helper also picks a case: `switch (plural(n, '1', '2', '0'))`.
Russian words have three forms: see `plural_ru`.

```js
plural(1, '# step', '# steps')               // '1 step'
plural(2, '# step', '# steps')               // '2 steps'
plural(11, '# step', '# steps')              // '11 steps'
plural(21, '# step', '# steps')              // '21 steps'
plural(0, '# step', '# steps')               // '0 steps'
plural(0, '# step', '# steps', 'no steps')   // 'no steps'
plural(21, '1', '2', '0')                    // '2'
```
