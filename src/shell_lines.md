Basic helper for running external commands via `execFile`, and splits stdout into lines.

- Fails if the command exits with non-zero code.
- Fails if anything is printed to `stderr`.
- Strips trailing newline(s).
- Returns array of lines.

## Signature

```
shell_lines(args, options) → Promise<string[]>
```
