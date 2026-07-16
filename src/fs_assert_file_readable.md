Asserts that `file` is a regular file readable by everyone: rejects unless the mode
includes all three read bits (`0o444`).
Like `fs_assert_file_exists`, the check is lstat-based, so symlinks fail it.
