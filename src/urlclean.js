const querystring = require('querystring');

/**
 * Replace unnecessary encodes symbols with chars. The returned url will be
 * more human-friendly, at the same time it will still be valid url.
 */
function urlclean(url)
{
    // The #fragment is not part of the query string: without splitting it
    // off first it would be percent-encoded into the last query value.
    const h = url.indexOf('#');
    const hash = (h === -1) ? '' : url.slice(h);
    if (hash) {
        url = url.slice(0, h);
    }
    const i = url.indexOf('?') + 1;
    if (i) {
        const s = querystring.stringify(querystring.parse(url.slice(i)), '&', '=', {
            encodeURIComponent: function (v) {
                return encodeURIComponent(v).replaceAll('%3A', ':').replaceAll('%2F', '/');
            },
        });
        return url.slice(0, i) + s + hash;
    }
    return url + hash;
}

module.exports = urlclean;
