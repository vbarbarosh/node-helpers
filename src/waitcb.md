Wait for a Node-like function to finish (which will call `callback`
with 2 arguments: `error` and `value`).

```js
await waitcb(cb => fs.writeFile('a', 'hello\n', cb));
```

The same as:

```js
const [promise, resolve, reject] = (a => [new Promise((...v) => a = v), ...a])();
```
