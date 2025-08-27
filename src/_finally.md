`_finally` lets you register cleanup code that always runs when the scope ends.

```js
this.foo = 12345;
using _ = _finally(() => this.foo = null);
// ...
```

This is essentially the same as:

```js
this.foo = 12345;
try {
    // ..
}
finally {
    this.foo = null;
}
```
