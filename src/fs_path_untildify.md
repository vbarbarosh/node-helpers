Expands a leading `~` in a path to the current user's home directory (ported from sindresorhus/untildify).
Only a `~` that is the whole path or is followed by `/` or `\` is expanded; anything else is returned unchanged.
If the home directory cannot be determined, the path is returned as-is.

```js
fs_path_untildify('~/x');    // '/home/ubuntu/x'
fs_path_untildify('~foo/x'); // '~foo/x'
```
