const querystring = require('querystring');

/**
 * Replace unnecessary encodes symbols with chars. The returned url will be
 * more human-friendly, at the same time it will still be valid url.
 */
function urlclean(url)
{
    const i = url.indexOf('?') + 1;
    if (i) {
        const s = querystring.stringify(querystring.parse(url.slice(i)), '&', '=', {
            encodeURIComponent: function (v) {
                return encodeURIComponent(v).replaceAll('%3A', ':').replaceAll('%2F', '/');
            },
        });
        return url.slice(0, i) + s;
    }
    return url;
}

module.exports = urlclean;
