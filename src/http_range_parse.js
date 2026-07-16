/**
 * @link https://github.com/jshttp/range-parser
 */
function http_range_parse(range, total)
{
    const m = range.match(/^bytes\s*=\s*(\d*)-(\d*)$/);

    if (!m || (!m[1] && !m[2])) {
        throw new Error(`Cannot parse range "${range}". Only "bytes=FIRST-LAST", "bytes=FIRST-", or "bytes=-LAST" are supported.`);
    }

    let first = +m[1];
    let last = +m[2];

    if (!m[1]) { // -LAST: a suffix longer than the resource means the whole resource (RFC 7233)
        first = Math.max(0, total - last);
        last = total - 1;
    }
    else if (!m[2]) { // FIRST-
        last = total - 1;
    }
    else if (last >= total) { // FIRST-LAST reaching past the end reads to the end (RFC 7233)
        last = total - 1;
    }

    if (first < 0 || first > last || first >= total) {
        throw new Error(`Invalid range: first=${first}, last=${last}, total=${total}, expr="${range}"`);
    }

    return {first, last};
}

module.exports = http_range_parse;
