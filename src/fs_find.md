Recursively lists a directory tree as an array of `fs_fi` info objects with absolute
pathnames — the root entry first, then its contents depth-first in `readdir` order.
A non-directory pathname yields just its own entry.
Broken symlinks are reported (`target_fi: null`) instead of failing the walk,
and symlinks to directories are not descended into.
See `fs_list` for a shallow listing and `fs_list_deep` for a recursive one
that keeps pathnames relative to the input.
