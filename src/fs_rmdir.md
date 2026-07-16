Removes an **empty** directory (thin wrapper over `fs.promises.rmdir`).
Rejects if the path is missing (`ENOENT`), not empty (`ENOTEMPTY`), or not a directory.
Use `fs_rmrf` to remove a directory with contents.
