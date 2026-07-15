Generates a numeric sequence.

**Supported forms:**
- `range(stop)` — from `0` up to `stop` (exclusive)
- `range(start, stop)` — from `start` up to `stop` (exclusive)
- `range(start, stop, step)` — with custom step

**Rules:**
- The `stop` value is **exclusive**
- Positive `step` counts **up** while `value < stop`
- Negative `step` counts **down** while `value > stop`
- If `step` direction does not allow progress, the result is an empty array
- `step = 0` never makes progress and gives an empty array
- The output is capped at `limit` items (4th parameter, default `1e6`)

**Returns:**
An array of numbers.
