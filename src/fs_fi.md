Returns extended file info: an lstat `Stats` object augmented with `pathname`, `basename`,
`flags` (e.g. `['is_file']`) and `flags_map` (e.g. `{is_file: true}`).
For a symlink it also resolves the target: `target` is the raw link text and `target_fi`
the target's own info object — or `null` for a broken symlink, so directory listings
(`fs_find`, `fs_list`, ...) never fail on dangling links.

```js
await fs_fi('/tmp/d/link');    // link → 'data.txt'
// { ..., flags: ['is_symbolic_link'], target: 'data.txt',
//   target_fi: { pathname: '/tmp/d/data.txt', flags: ['is_file'], ... } }
```
