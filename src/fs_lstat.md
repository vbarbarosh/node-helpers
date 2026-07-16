Thin wrapper over `fs.promises.lstat(path, options)`: stats the link itself instead of
following symlinks.
See `fs_stat` (follows symlinks) and `fs_fi` (lstat plus pathname/flags/symlink-target info).
