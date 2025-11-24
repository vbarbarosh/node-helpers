Basic helper for running external commands via `execFile`.

- Fails if the command exits with non-zero code.
- Fails if anything is printed to `stderr`.
- Resolves with `stdout` (string), exactly as produced.

## Signature

```
shell(args, options) → Promise<string>
```

## Notes

- `args[0]` is the executable; `args[1..]` are arguments.
- Suitable for commands that produce clean stdout and no warnings.
