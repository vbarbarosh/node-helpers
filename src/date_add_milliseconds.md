Adds `milliseconds` milliseconds to a `Date` via `setMilliseconds`. **Mutates
the passed `Date` in place and returns the same instance** — clone first if the
original must be preserved. Negative values subtract; overflow rolls over into
seconds and beyond.
