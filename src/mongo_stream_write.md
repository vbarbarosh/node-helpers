Object-mode writable that feeds batches of `bulkWrite` operations to a mongo
collection. Every chunk written to it must be an array of operations; it is
passed to `collection.bulkWrite(operations)` as is.

- Up to `concurrency` (default `1`) `bulkWrite` calls run in flight; further
  writes wait until a slot frees up.
- A `bulkWrite` error is reported on the next write or when the stream
  finishes. `final` and `destroy` wait for all in-flight batches first, so an
  error from the last batch is never silently dropped.
- A non-array chunk errors the stream (`An array of objects is expected.`).

## Signature

```
mongo_stream_write({collection, concurrency = 1}) → stream.Writable
```
