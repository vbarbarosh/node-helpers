Recursively lists `path` as an array of `fs_fi` info objects, including the root entry
itself and every directory below it.
Traversal is stack-based: the root comes first, but the rest is in no particular order.
Pathnames are joined from the input, so they stay relative if the input is relative.
See `fs_list` (shallow) and `fs_find` (recursive, absolute pathnames, depth-first order).
