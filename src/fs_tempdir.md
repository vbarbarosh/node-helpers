```js
await fs_tempdir(async function (d) {
    await fs_write(`${d}/input.txt`, 'hello');
    await shell(['ls', '-alh'], {cwd: d});
});
```
