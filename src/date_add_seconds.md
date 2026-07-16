Adds `seconds` seconds to a `Date` via `setSeconds`. **Mutates the passed
`Date` in place and returns the same instance** — clone first if the original
must be preserved. Negative values subtract; overflow rolls over into minutes
and beyond.
