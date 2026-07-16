Formats a duration in seconds as `HH:MM:SS`. Hours are always present and grow
beyond two digits as needed. Fractional seconds are truncated toward zero. The
`'-'` prefix appears only for `seconds <= -1`, so values in `(-1, 0)` format as
plain `'00:00:00'`.

```js
format_seconds(3661)       // '01:01:01'
format_seconds(1000000)    // '277:46:40'
format_seconds(-0.9)       // '00:00:00'
format_seconds(-1)         // '-00:00:01'
```
