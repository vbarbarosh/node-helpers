const axios = require('axios');
const format_thousands = require('./format_thousands');
const parse_http_content_range = require('./parse_http_content_range');

async function http_get_stream_range(url, first, last)
{
    const a = Number.isInteger(first) ? first : '';
    const b = Number.isInteger(last) ? last : '';
    const headers = {Range: `bytes=${a}-${b}`};
    const res = await axios.get(url, {responseType: 'stream', headers});
    const out = res.data;
    out.headers = res.headers;
    try {
        if (res.headers['content-range']) {
            out.content_range = parse_http_content_range(res.headers['content-range']);
        }
        else if (res.headers['content-length']) {
            const len = +res.headers['content-length'];
            out.content_range = parse_http_content_range(`bytes 0-${len - 1}/${len}`);
        }
        else {
            // Chunked 200 response: the body starts at byte 0, size unknown
            out.content_range = {type: 'bytes', first: 0, last: null, total: null};
        }
    }
    catch (error) {
        out.destroy(); // release the socket; nobody will ever read this stream
        throw error;
    }
    // A server reaching the end of the resource returns a shorter range than
    // requested: `bytes=0-999999` of a 500-byte file is `bytes 0-499/500` (RFC 7233)
    const expected_last = (b === '' || out.content_range.total === null) ? b : Math.min(b, out.content_range.total - 1);
    if (a !== '' && out.content_range.first !== a) {
        out.destroy(new Error(`First byte of a returned range (${fmt(out.content_range.first)}) is not as expected: [${fmt(a)}]`));
    }
    else if (b !== '' && out.content_range.last !== expected_last) {
        out.destroy(new Error(`Last byte of a returned range (${fmt(out.content_range.last)}) is not as expected: [${fmt(expected_last)}]`));
    }
    out.total = out.content_range.total;
    return out;
}

function fmt(v)
{
    return v === null ? 'null' : format_thousands(v);
}

module.exports = http_get_stream_range;
