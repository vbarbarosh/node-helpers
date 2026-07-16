Parses a human-readable size string into a number of bytes. Units are
1024-based: `B`, `KB`, `MB`, `GB`, `TB`, `PB`; the `KiB`/`MiB` spellings are
accepted and mean the same thing. Matching is case-insensitive and anchored:
whitespace around and between number and unit is fine, but any other
trailing/leading garbage gives `NaN`. A bare number means bytes. The result
is `Math.floor`ed. Non-strings (including numbers) return `NaN`.

```js
parse_bytes('10.5MB')   // 11010048
parse_bytes('1KIB')     // 1024
parse_bytes('5 mb')     // 5242880
parse_bytes('123')      // 123 (bare number means bytes)
parse_bytes('12KB34')   // NaN (trailing garbage, not 12KB)
parse_bytes(123)        // NaN (not a string)
```
