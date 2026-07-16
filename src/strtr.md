Replaces substrings in `subject` using a `{from: to}` map, like PHP's
`strtr`. Single pass: replaced text is never scanned again, so maps like
`{a: 'b', b: 'c'}` cannot cascade. When keys overlap, the longest matching
key wins regardless of map order. Empty keys are ignored.

```js
strtr('hello world', {world: 'there'})  // 'hello there'
strtr('hello', {he: 'X', hell: 'Y'})    // 'Yo' (longest key wins)
strtr('ab', {a: 'b', b: 'c'})           // 'bc' (single pass, no cascade)
strtr('hello', {l: ''})                 // 'heo'
```
