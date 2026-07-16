Splits an array into up to `max_chunks` balanced chunks, keeping at least
`min_items_per_chunk` items per chunk when possible. Chunk sizes differ by at
most 1 item; earlier chunks receive the extras. Originally designed for
distributing jobs across threads: `array_chunk_balanced(jobs, max_threads, min_jobs_per_thread)`.

**Edge cases:**
- Empty input returns `[]`.
- If there are too few items to satisfy `min_items_per_chunk` even for a
  single chunk, all items go into one chunk.

```js
array_chunk_balanced([1, 2, 3, 4, 5, 6, 7], 3, 2)    // [[1, 2, 3], [4, 5], [6, 7]]
array_chunk_balanced([1, 2, 3], 5, 5)                // [[1, 2, 3]]
```
