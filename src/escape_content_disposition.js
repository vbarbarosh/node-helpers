/**
 * @link https://stackoverflow.com/a/72823174
 * @link https://github.com/jshttp/content-disposition/tree/master
 */
function escape_content_disposition(s)
{
    const out = s.replaceAll('\\', '\\\\')
        .replaceAll('"', '\\"')
        .replaceAll('%', '\\%')
        .replaceAll('\n', '%x0A')
        .replaceAll('\0', '%x00');
    // A bare value must be a pure RFC 7230 token: any other character
    // (space, ';', ',', '"', '\', ...) requires the whole value to be a
    // quoted-string — an unquoted 'a\"b' or 'a,b' breaks header parsing.
    if (out === s && /^[!#$%&'*+.^_`|~0-9a-zA-Z-]+$/.test(s)) {
        return s;
    }
    return `"${out}"`;
}

module.exports = escape_content_disposition;
