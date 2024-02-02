function parse_http_content_range(value)
{
    // Content-Range: bytes 262144000-272629759/5037662208
    const m = value.match(/^(\w+)\s+(\d+)-(\d+)[/](\d+)$/);
    if (!m) {
        throw new Error(`Invalid Content-Range: [${value}]`);
    }
    const type = m[1];
    const first = +m[2];
    const last = +m[3];
    const total = +m[4];
    return {type, first, last, total};
}

module.exports = parse_http_content_range;
