Asserts that `file` is a regular file; resolves with nothing on success.
Rejects with `ENOENT` if the path is missing, and with `Not a file: <file>` for anything else.
The check is lstat-based (`fs_fi`), so even a symlink pointing at a regular file rejects.
