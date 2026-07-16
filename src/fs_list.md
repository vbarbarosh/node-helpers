Shallow directory listing: resolves with an array of `fs_fi` info objects for the direct
entries of `pathname` (the directory itself is not included).
A non-directory pathname yields `[fi]` of itself.
Entry pathnames are `pathname` joined with each name, so they stay relative if the input is relative.
See `fs_list_deep` and `fs_find` for recursive variants.
