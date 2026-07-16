Thin wrapper over `fs.promises.mkdir(path, options)`.
Rejects with `EEXIST` if the path exists, and does not create missing parents unless
`options.recursive` is set — see `fs_mkdirp` for that.
