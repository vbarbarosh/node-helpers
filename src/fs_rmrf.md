Removes a file or directory recursively, like `rm -rf`.

**Signature:** `fs_rmrf(path, progress = ignore) → Promise<void>`

- A missing path is ignored, at every level: an entry that somebody else
  removed in the meantime counts as removed.
- A symlink is removed itself; its target is never followed, also when the
  path ends with a separator (`link/` removes the link).
- Every entry is tried. When some cannot be removed, the call rejects with
  the first cause once the others are gone; a path that cannot be examined
  (`EACCES`) rejects as well, it is not taken for a missing one.
- Entries are removed in parallel, with at most 32 file system calls in
  flight for one call.
- File names are handled as bytes, so a name that is not valid UTF-8 is
  removed like any other.
- Refused before anything is touched: an empty path, a value that is not a
  string, the root of the file system, and a path whose last part is `.` or
  `..` (as `rm` does).

The optional `progress` callback is called as `progress('rm', path)` before each file
and `progress('rmdir', path)` before each directory removal.

**A directory swapped under the call.** Node has no `openat()`, so an entry is
always reached by its path. Each directory is examined again after its names
are read, and nothing in it is touched when it has been replaced (by a symlink
to another directory, for one); the path is then handled as what it has become.
This narrows the window in which another process can redirect the removal,
it does not close it: do not use `fs_rmrf` on a tree that an untrusted
process can write to.
