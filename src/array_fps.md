Returns frame timestamps (in seconds) for a clip of `duration_sec` sampled at
`fps` frames per second: `Math.floor(duration_sec * fps)` evenly spaced values
from `0` up to just under `duration_sec`. Each timestamp is pulled back by an
epsilon of `0.00001` and rounded to it, so the last frame never lands exactly
on the duration.

If the clip fits one frame or less (`duration_sec * fps <= 1`), returns `[0]`.

```js
array_fps(1, 4)    // [0, 0.33333, 0.66666, 0.99999]
array_fps(1, 1)    // [0]
```
