Thin wrapper around `zlib.createGunzip(options)`: a transform that
decompresses a gzipped byte stream. Corrupt input errors the stream
(`incorrect header check`).

```js
await stream.promises.pipeline(gzipped_source, stream_gunzip(), destination);
```
