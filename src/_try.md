Safely evaluates code and falls back to a default value if something goes wrong.

```js
const time = _try(() => this.$refs.iframe.contentWindow.document.timeline.time(), 0);
```
