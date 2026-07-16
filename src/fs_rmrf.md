Removes a file or directory recursively, like `rm -rf`.
A missing path is silently ignored; children of a directory are removed in parallel.
Uses `lstat`, so a symlink is removed itself — its target is never followed.

**Signature:** `fs_rmrf(path, progress = ignore) → Promise<void>`

The optional `progress` callback is called as `progress('rm', path)` before each file
and `progress('rmdir', path)` before each directory removal.
