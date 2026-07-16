Thin wrapper over `fs.promises.readdir(path, options)`.
Resolves with an array of basenames (not full paths); pass `{withFileTypes: true}` for `Dirent` objects.
Rejects if `path` is missing or not a directory.
