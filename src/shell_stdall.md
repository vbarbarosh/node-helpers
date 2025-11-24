Runs a command via `execFile` and returns both stdout and stderr.

- Rejects only on exec error.
- Resolves with `{stdout, stderr}`.
- Does NOT treat stderr output as failure.

## Signature

```
shell_stdall(args, options) → Promise<{stdout: string, stderr: string}>
```
