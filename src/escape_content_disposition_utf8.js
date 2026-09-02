/**
 * RFC 5987 ext-value for a `filename*` parameter: `UTF-8''<percent-encoded>`.
 * Everything outside attr-char is percent-encoded, as jshttp/content-disposition does.
 */
function escape_content_disposition_utf8(s)
{
    // eslint-disable-next-line no-control-regex
    return `UTF-8''` + encodeURIComponent(s).replace(/[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
}

module.exports = escape_content_disposition_utf8;
