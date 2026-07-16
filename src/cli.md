Entry point for Node CLI apps. Runs `main` (sync or async), keeps the event
loop alive until it settles, and turns a failure into a proper exit code.

- Resolves → the process exits naturally with code `0`.
- Rejects or throws → the error is passed to `report` (default
  `console.error`), then `process.exit(1)`.
- An `ExitCodeError` exits with its `exit_code` instead of `1`.
- Synchronous throws from `main` are handled the same way as rejections —
  they do not bypass `report` or the exit code handling.

```js
cli(async function main() {
    // ...
});
```
