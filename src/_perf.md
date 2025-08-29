Measures time from the current position till the end of a block scope.

```js
app.component('sidebar', {
    template: `...`,
    methods: {
        click_download: async function () {
            using _ = _perf('download');
            // ...
        },
    },
});
```
