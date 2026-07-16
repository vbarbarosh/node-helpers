Transform that consumes all input chunks and emits a single output chunk at
flush: the md5 hex digest of the whole stream. An empty stream still emits
`'d41d8cd98f00b204e9800998ecf8427e'`. Equivalent to `stream_hash('md5')`;
the source carries a TODO to rename this to `stream_hash_md5`.

```js
const chunks = await stream.Readable.from(['aaa', 'bbb']).pipe(stream_md5()).toArray();
Buffer.concat(chunks).toString('utf8');    // '6547436690a26a399603a7096e876a2d'
```
