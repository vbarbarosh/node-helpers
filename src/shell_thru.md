Convenience wrapper over `shell_spawn` with `stdio: 'inherit'`.

- Child stdout/stderr are streamed directly to parent terminal.
- Supports `proc.init()` and `proc.promise()` like `shell_spawn`.

## Signature

```
shell_thru(args, options) → ChildProcess
```
