Spawn-based helper for long-running or streaming commands.

Provides two promises:

- `proc.init()` — resolves when the child emits `spawn`.
- `proc.promise()` — resolves when the child exits with code 0.

## Failure semantics

- Rejects if `error` event occurs.
- Rejects if exit code is non-zero.
- If child dies by signal, treated as non-zero exit (uses exitCode = 128).

## Signature

```
const proc = shell_spawn(args, options)
proc.init() → Promise<ChildProcess>
proc.promise() → Promise<void>
```

## Notes

- Output is streamed (not buffered).
- Use when you need live stdout/stderr or long-running jobs.
