Converts an arbitrary string (a spreadsheet header, an API field name) into
a safe snake_case identifier: camelCase is split first
(`str_camel_to_snake`), accents and symbols are handled by
`sanitize_dash_name`, and the dashes become underscores. The result always
matches `[a-z0-9_]+`: an empty result becomes `'_'`, and a leading digit is
prefixed with `'_'`.

```js
sanitize_var_name('Image URL')          // 'image_url'
sanitize_var_name('ItemInternalId')     // 'item_internal_id'
sanitize_var_name('@odata.etag')        // 'odata_etag'
sanitize_var_name('1000-stories')       // '_1000_stories'
sanitize_var_name('')                   // '_'
```
