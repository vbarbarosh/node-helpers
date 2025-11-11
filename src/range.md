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

**Returns:**
An array of numbers.
