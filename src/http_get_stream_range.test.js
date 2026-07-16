const assert = require('assert');
const http = require('http');
const http_get_stream_range = require('./http_get_stream_range');
const http_range_parse = require('./http_range_parse');

const BODY = Buffer.from('0123456789'.repeat(100)); // 1000 bytes

describe('http_get_stream_range', function () {
    let base, server;

    before(function (done) {
        server = http.createServer(function (request, response) {
            switch (request.url) {
            case '/range': {
                let range = null;
                try {
                    range = http_range_parse(request.headers.range || '', BODY.length);
                }
                catch (error) {
                    // no or unparsable Range header → plain 200 response
                }
                if (range === null) {
                    response.writeHead(200, {'Content-Length': BODY.length});
                    response.end(BODY);
                }
                else {
                    const {first, last} = range;
                    response.writeHead(206, {
                        'Content-Range': `bytes ${first}-${last}/${BODY.length}`,
                        'Content-Length': last - first + 1,
                    });
                    response.end(BODY.subarray(first, last + 1));
                }
                break;
            }
            case '/chunked':
                // no Content-Length → Transfer-Encoding: chunked
                response.writeHead(200);
                response.write(BODY);
                response.end();
                break;
            case '/wrong-first':
                response.writeHead(206, {'Content-Range': `bytes 100-199/${BODY.length}`, 'Content-Length': 100});
                response.end(BODY.subarray(100, 200));
                break;
            default:
                response.writeHead(404);
                response.end();
                break;
            }
        });
        server.listen(0, function () {
            base = `http://127.0.0.1:${server.address().port}`;
            done();
        });
    });

    after(function (done) {
        server.closeAllConnections();
        server.close(done);
    });

    it('should return the requested range', async function () {
        const rs = await http_get_stream_range(`${base}/range`, 100, 199);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 100, last: 199, total: 1000});
        assert.strictEqual(rs.total, 1000);
        assert.deepStrictEqual(await read_all(rs), BODY.subarray(100, 200));
    });
    it('should synthesize content_range from Content-Length when no range was requested', async function () {
        const rs = await http_get_stream_range(`${base}/range`);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 0, last: 999, total: 1000});
        assert.deepStrictEqual(await read_all(rs), BODY);
    });
    it('should accept a chunked 200 response with an unknown total', async function () {
        const rs = await http_get_stream_range(`${base}/chunked`);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 0, last: null, total: null});
        assert.strictEqual(rs.total, null);
        assert.deepStrictEqual(await read_all(rs), BODY);
    });
    it('should accept a range clamped to the end of the resource', async function () {
        // `bytes=0-999999` of a 1000-byte file is `bytes 0-999/1000` (RFC 7233)
        const rs = await http_get_stream_range(`${base}/range`, 0, 999999);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 0, last: 999, total: 1000});
        assert.deepStrictEqual(await read_all(rs), BODY);
    });
    it('should reject when the first byte differs from the requested one (even 0)', async function () {
        const rs = await http_get_stream_range(`${base}/wrong-first`, 0, 199);
        await assert.rejects(read_all(rs), /First byte/);
    });
    it('should reject when the last byte differs from the requested one', async function () {
        const rs = await http_get_stream_range(`${base}/wrong-first`, 100, 300);
        await assert.rejects(read_all(rs), /Last byte/);
    });
    it('should reject when the server ignores the requested range', async function () {
        const rs = await http_get_stream_range(`${base}/chunked`, 100, 199);
        await assert.rejects(read_all(rs), /First byte/);
    });
});

async function read_all(rs)
{
    const chunks = [];
    for await (const chunk of rs) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}
