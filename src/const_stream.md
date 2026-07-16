Constants for passing values through Node.js streams that the stream
protocol itself cannot carry.

**Members:**
- `const_stream.null` — a `Symbol('stream[null]')` used to represent `null`
  inside an object-mode stream, since pushing a real `null` is the
  end-of-stream mark.
