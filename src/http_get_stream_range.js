const axios = require('axios');
const format_thousands = require('./format_thousands');
const parse_http_content_range = require('./parse_http_content_range');

async function http_get_stream_range(url, first, last, options)
{
    const a = Number.isInteger(first) ? first : '';
    const b = Number.isInteger(last) ? last : '';
    const headers = {...options?.headers};
    if (a !== '' || b !== '') {
        headers.Range = `bytes=${a}-${b}`;
    }
    const res = await axios.get(url, {responseType: 'stream', ...options, headers});
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
    if (a !== '' && out.content_range.first !== a) {
        out.destroy(new Error(`First byte of a returned range (${fmt(out.content_range.first)}) is not as expected: [${fmt(a)}]`));
    }
    else if (a !== '' && b !== '') {
        const expected_last = out.content_range.total === null ? b : Math.min(b, out.content_range.total - 1);
        if (out.content_range.last !== expected_last) {
            out.destroy(new Error(`Last byte of a returned range (${fmt(out.content_range.last)}) is not as expected: [${fmt(expected_last)}]`));
        }
    }
    else if (a !== '' && out.content_range.total !== null && out.content_range.last !== out.content_range.total - 1) {
        const expected_last = out.content_range.total - 1;
        out.destroy(new Error(`Last byte of a returned range (${fmt(out.content_range.last)}) is not as expected: [${fmt(expected_last)}]`));
    }
    else if (b !== '') {
        const actual_length = out.content_range.last - out.content_range.first + 1;
        const expected_length = out.content_range.total === null ? Math.min(actual_length, b) : Math.min(out.content_range.total, b);
        if (out.content_range.last === null) {
            // Chunked 200 with no Content-Range: the server ignored the suffix range
            out.destroy(new Error(`Server ignored the requested suffix range of ${fmt(b)} bytes and returned a response of unknown length`));
        }
        else if (actual_length !== expected_length) {
            out.destroy(new Error(`Length of a returned range (${fmt(actual_length)}) is not as expected: [${fmt(expected_length)}]`));
        }
        else if (out.content_range.total !== null && out.content_range.last !== out.content_range.total - 1) {
            const expected_last = out.content_range.total - 1;
            out.destroy(new Error(`Last byte of a returned range (${fmt(out.content_range.last)}) is not as expected: [${fmt(expected_last)}]`));
        }
    }
    out.total = out.content_range.total;
    return out;
}

function fmt(v)
{
    return v === null ? 'null' : format_thousands(v);
}

module.exports = http_get_stream_range;
