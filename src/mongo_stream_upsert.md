Object-mode writable that inserts or replaces documents in a mongo collection.
Every chunk written to it must be an array of documents; each document becomes
a `replaceOne` upsert keyed by its `_id`, and the batch goes to
`collection.bulkWrite`.

- Up to `concurrency` (default `1`) `bulkWrite` calls run in flight; further
  writes wait until a slot frees up.
- A `bulkWrite` error is reported on the next write or when the stream
  finishes. `final` and `destroy` wait for all in-flight batches first, so an
  error from the last batch is never silently dropped.
- A non-array chunk errors the stream (`An array of objects is expected.`).

## Signature

```
mongo_stream_upsert({collection, concurrency = 1}) → stream.Writable
```
