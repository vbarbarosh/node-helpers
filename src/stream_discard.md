A writable sink that accepts and discards every chunk — useful to drain a
pipeline whose output is irrelevant. Byte mode by default; pass
`{objectMode: true}` for object streams. Consumes empty streams fine.

```js
await stream.promises.pipeline(source, stream_discard());
await stream.promises.pipeline(objects, stream_discard({objectMode: true}));
```
