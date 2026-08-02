/**
 * Parse an absolute or relative URL-like string without rejecting malformed
 * URL text. Missing components are returned as null.
 */
function urlparts(input)
{
    const out = {
        protocol: null,
        username: null,
        password: null,
        host: null,
        port: null,
        path: null,
        search: null,
        hash: null,
        query: {},
        fragment: {},
    };

    if (typeof input !== 'string') {
        return out;
    }

    let resource = input;
    const hash_pos = resource.indexOf('#');
    if (hash_pos !== -1) {
        out.hash = resource.slice(hash_pos);
        out.fragment = parse_params(resource.slice(hash_pos + 1));
        resource = resource.slice(0, hash_pos);
    }

    const query_pos = resource.indexOf('?');
    if (query_pos !== -1) {
        out.search = resource.slice(query_pos);
        out.query = parse_params(resource.slice(query_pos + 1));
        resource = resource.slice(0, query_pos);
    }

    const protocol_match = resource.match(/^([A-Za-z][A-Za-z0-9+.-]*):/);
    if (protocol_match) {
        out.protocol = protocol_match[1].toLowerCase();
        resource = resource.slice(protocol_match[0].length);
    }

    if (resource.startsWith('//')) {
        const slash_pos = resource.indexOf('/', 2);
        const authority = slash_pos === -1
            ? resource.slice(2)
            : resource.slice(2, slash_pos);

        out.path = slash_pos === -1 ? null : resource.slice(slash_pos) || null;
        parse_authority(authority, out);
    }
    else {
        out.path = resource || null;
    }

    return out;
}

function parse_params(value)
{
    const out = {};
    for (const field of value.split('&')) {
        const item = new URLSearchParams(field).entries().next();
        if (!item.done) {
            const [key, value] = item.value;
            Object.defineProperty(out, key, {
                configurable: true,
                enumerable: true,
                value,
                writable: true,
            });
        }
    }
    return out;
}

function parse_authority(authority, parts)
{
    const at_pos = authority.lastIndexOf('@');
    let host = authority;

    if (at_pos !== -1) {
        const userinfo = authority.slice(0, at_pos);
        const colon_pos = userinfo.indexOf(':');

        parts.username = colon_pos === -1 ? userinfo : userinfo.slice(0, colon_pos);
        parts.password = colon_pos === -1 ? null : userinfo.slice(colon_pos + 1);
        host = authority.slice(at_pos + 1);
    }

    if (host.startsWith('[')) {
        const bracket_pos = host.indexOf(']');
        if (bracket_pos !== -1 && host[bracket_pos + 1] === ':') {
            parts.host = host.slice(0, bracket_pos + 1) || null;
            parts.port = host.slice(bracket_pos + 2);
            return;
        }
    }

    const first_colon_pos = host.indexOf(':');
    const last_colon_pos = host.lastIndexOf(':');
    if (first_colon_pos !== -1 && first_colon_pos === last_colon_pos) {
        parts.host = host.slice(0, first_colon_pos) || null;
        parts.port = host.slice(first_colon_pos + 1);
        return;
    }

    parts.host = host || null;
}

module.exports = urlparts;
