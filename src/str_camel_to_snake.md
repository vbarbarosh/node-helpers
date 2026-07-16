Converts camelCase/PascalCase to snake_case and lowercases the result.
Acronyms are kept together as one word (`SomeUPCCode` → `some_upc_code`),
though an acronym at the end of the string has nothing to split it from the
previous word (`thisISNT` → `this_isnt`).

```js
str_camel_to_snake('CamelCase')         // 'camel_case'
str_camel_to_snake('SomeUPCCode')       // 'some_upc_code'
str_camel_to_snake('thisISDifficult')   // 'this_is_difficult'
str_camel_to_snake('UPC')               // 'upc'
```
