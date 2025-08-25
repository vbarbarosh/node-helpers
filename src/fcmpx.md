Comparator builder using compact expressions.

fcmp expression — Creates an `fcmp` function from an expression, suitable for use with `[].sort()`.

```js
fcmpx('user.email')
fcmpx('-user.age,user.email')
fcmpx(v => v.user.email)
fcmpx(['user.age', 'user.email'])
fcmpx(['-user.age', 'user.email'])
```

Sorting rule: Missing values are considered greater than any defined value
and are therefore placed after all defined values.
