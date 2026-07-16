Transform that consumes all input chunks and emits a single output chunk at
flush: the hex digest of the whole stream. `algorithm` defaults to `'md5'`;
any `crypto.createHash` algorithm name works, and `options` is passed
through to it. An empty stream still emits the digest of empty input.

```js
const chunks = await stream.Readable.from(['aaa', 'bbb']).pipe(stream_hash('sha256')).toArray();
Buffer.concat(chunks).toString('utf8');
// '2ce109e9d0faf820b2434e166297934e6177b65ab9951dbc3e204cad4689b39c'
```
