Returns the shape of a value with every leaf replaced by its `gettype` name.
Objects keep their keys; an array becomes the deduplicated, sorted list of
its distinct member schemas (compared via `json_stringify_stable`), so
`[1, 2, 'x']` collapses to `['number', 'string']`. Useful for eyeballing the
structure of unknown JSON.

```js
object_schema({name: 'Bob', tags: ['a', 1], meta: {ok: true}})
// {name: 'string', tags: ['number', 'string'], meta: {ok: 'boolean'}}
object_schema([{a: 1}, {a: 2}, {a: 'x'}])
// [{a: 'number'}, {a: 'string'}]
```
