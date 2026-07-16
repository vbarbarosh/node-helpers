Combines several writable streams into one object-mode writable that
duplicates every chunk to all of them. Backpressure is respected: a write
completes only after every target accepted the chunk.

- Zero streams → a sink that accepts and discards all writes.
- One stream → returned as is (no wrapper).
- Ending the multiplex ends all targets; destroying it destroys all targets.
- An error in any target destroys the multiplex (and, through it, the other
  targets) with that error — the first error wins.

```js
await stream.promises.pipeline(
    source,
    stream_multiplex(ws1, ws2),
);
```
