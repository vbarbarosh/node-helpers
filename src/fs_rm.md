Removes a single file (thin wrapper over `fs.promises.unlink`).
Rejects if the path is missing (`ENOENT`) or is a directory.

See also: `fs_rmf` (ignore missing), `fs_rmdir` (empty directory), `fs_rmrf` (recursive, never throws on missing).
