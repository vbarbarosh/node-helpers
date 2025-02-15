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
    if (out.match(/\s|;/)) {
        return `"${out}"`;
    }
    return out;
}

module.exports = escape_content_disposition;
