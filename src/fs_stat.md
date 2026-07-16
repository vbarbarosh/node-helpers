Thin wrapper over `fs.promises.stat(path, options)`: resolves with an `fs.Stats` object.
Follows symlinks (use `fs_lstat` to stat the link itself); rejects with `ENOENT` if the path is missing.
