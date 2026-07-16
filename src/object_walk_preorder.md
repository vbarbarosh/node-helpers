Recursively visits every nested value of an object/array in preorder
(parents before children), calling `fn(value, path)`. The root itself is not
visited (`path` would be empty). `path` is an array of keys from the root;
array elements contribute `'*'` instead of their index. `null` values are
visited but not descended into. Returns nothing.

```js
object_walk_preorder({aaa: {foo: 1}, bbb: [10, 20]}, function (value, path) {
    console.log(path.join('/'), value);
});
// aaa {foo: 1}
// aaa/foo 1
// bbb [10, 20]
// bbb/* 10
// bbb/* 20
```
