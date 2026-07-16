**Deprecated** in favor of `fs_walk`.
Recursive listing like `fs_find`, but keeps pathnames relative to the input and adds
`content_size` to every `fs_fi` entry: a file's own `size`, the recursive total of file
sizes for a directory, and `0` for anything else.
