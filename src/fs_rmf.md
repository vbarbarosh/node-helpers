Removes the file if it exists: `fs_rm` that swallows `ENOENT` (like `rm -f`).
Any other error (e.g. the path is a directory) is still thrown.
