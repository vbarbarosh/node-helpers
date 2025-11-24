Basic helper for running external commands via `execFile`, and parse result by JSON.parse.

- Fails if the command exits with non-zero code.
- Fails if anything is printed to `stderr`.
- Fails if stdout is not valid JSON.
- Resolves with parsed JSON value.

## Signature

```
shell_json(args, options) → Promise<any>
```
