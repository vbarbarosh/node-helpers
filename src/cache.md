Probably the most basic cache engine ever.

```javascript
await cache({
    get: () => fs_read_json('data.json'),
    set: v => fs_write_json('data.json', v),
    refresh: () => compute(),
});
```
