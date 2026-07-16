Converts a string to a lowercase dash-name (slug): accents are stripped via
NFD normalization, every other non-ASCII-alphanumeric character becomes a
dash, runs of dashes collapse, and leading/trailing dashes are trimmed.
Characters with no ASCII base letter (e.g. Cyrillic) are dropped, so the
result can be an empty string.

```js
sanitize_dash_name('1000 Stories')      // '1000-stories'
sanitize_dash_name('Ópera Prima')       // 'opera-prima'
sanitize_dash_name('Black & Decker')    // 'black-decker'
sanitize_dash_name('M&M\'s')            // 'm-m-s'
sanitize_dash_name('привет')            // ''
```
