Set, change, or remove query string parameters.

```js
urlmod('', {a: 1})          // '?a=1'  set
urlmod('?a=1', {a: 2})      // '?a=2'  change
urlmod('?a=1', {a: null})   // ''      remove
```
