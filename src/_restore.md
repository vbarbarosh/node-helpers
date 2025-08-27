The pattern "set a new value now, restore the old one when scope ends".

```js
using _ = _restore(false, v => [this.controls.play, this.controls.play = v]);
// ...
```

This is essentially the same as:

```js
{
    const _old = this.controls.play;
    this.controls.play = false;
    try {
        // ...
    }
    finally {
        this.controls.play = _old;
    }
}
```
