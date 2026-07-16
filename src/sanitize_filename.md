Thin wrapper around the [sanitize-filename](https://www.npmjs.com/package/sanitize-filename)
package: makes a string safe to use as a single filename by removing path
separators, reserved/control characters, and Windows-reserved names. It does
not slugify — spaces, dots, and unicode are kept.

```js
sanitize_filename('../some/file*name?.txt')     // '..somefilename.txt'
sanitize_filename('report: 2024/Q1.pdf')        // 'report 2024Q1.pdf'
```
