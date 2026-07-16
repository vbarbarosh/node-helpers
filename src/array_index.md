Builds an object mapping `read(item)` to the item itself. `read` defaults to
`identity`. When several items share a key, the last one wins.

```js
array_index([{uid: 'a'}, {uid: 'b'}], v => v.uid)
// {a: {uid: 'a'}, b: {uid: 'b'}}
```

Native alternative: `Object.fromEntries(items.map(v => [v.uid, v]))`.
