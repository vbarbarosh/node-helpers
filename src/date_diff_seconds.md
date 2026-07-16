Returns the difference `a - b` between two `Date`s in whole seconds:
`Math.floor((a.getTime() - b.getTime()) / 1000)`. Positive when `a` is later
than `b`. Because of the flooring, negative sub-second differences round away
from zero: if `b` is 500 ms later than `a`, the result is `-1`, not `0`.
