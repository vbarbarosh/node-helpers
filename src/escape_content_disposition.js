/**
 * @link https://stackoverflow.com/a/72823174
 * @link https://github.com/jshttp/content-disposition/tree/master
 */
function escape_content_disposition(s)
{
    const out = s.replaceAll('\\', '\\\\')
        .replaceAll('"', '\\"')
        .replaceAll('%', '\\%')
        // Control characters (\n, \r, \0, \x01..., DEL) are illegal in a
        // header value; encode every one of them as %xHH.
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1f\x7f]/g, c => '%x' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
        // A quoted-string may carry ISO-8859-1 only; anything above U+00FF
        // is replaced with '?' (use escape_content_disposition_utf8 for the RFC 5987 filename*).
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x00-\xff]/g, '?');
    // A bare value must be a pure RFC 7230 token: any other character
    // (space, ';', ',', '"', '\', ...) requires the whole value to be a
    // quoted-string — an unquoted 'a\"b' or 'a,b' breaks header parsing.
    if (out === s && /^[!#$%&'*+.^_`|~0-9a-zA-Z-]+$/.test(s)) {
        return s;
    }
    return `"${out}"`;
}

module.exports = escape_content_disposition;
