function parse_http_content_range(value)
{
    // Content-Range: bytes 262144000-272629759/5037662208
    // Content-Range: bytes */5037662208 (unsatisfied range → first/last are null)
    // Content-Range: bytes 0-499/* (unknown total → total is null)
    const m = value.match(/^(\w+)\s+(?:(\d+)-(\d+)|[*])[/](?:(\d+)|[*])$/);
    // "*/*" is not in the RFC 7233 grammar: an unsatisfied range must state
    // the complete length
    if (!m || (m[2] === undefined && m[4] === undefined)) {
        throw new Error(`Invalid Content-Range: [${value}]`);
    }
    const type = m[1];
    const first = m[2] === undefined ? null : +m[2];
    const last = m[3] === undefined ? null : +m[3];
    const total = m[4] === undefined ? null : +m[4];
    return {type, first, last, total};
}

module.exports = parse_http_content_range;
