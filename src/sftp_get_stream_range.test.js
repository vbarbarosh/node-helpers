const assert = require('assert');
const sftp_get_stream_range = require('./sftp_get_stream_range');
const sftp_server_listen = require('./sftp_get_stream_range.d/sftp_server');
const wait_while = require('./wait_while');

const BODY = Buffer.from(Array.from({length: 100000}, (v, i) => i % 251));

describe('sftp_get_stream_range', function () {
    let server;
    let server_empty;
    before(async function () {
        server = await sftp_server_listen(BODY);
        server_empty = await sftp_server_listen(Buffer.alloc(0));
    });
    after(async function () {
        await server.close();
        await server_empty.close();
    });

    it('should refuse a host key that is not pinned and close the connection', async function () {
        const before = server.closed();
        await assert.rejects(sftp_get_stream_range(server.url_unpinned('/data.bin'), 0, 9), {code: 'ERR_SFTP_HOST_KEY_NOT_PINNED'});
        await wait_while(() => server.closed() === before);
        const rs = await sftp_get_stream_range(server.url_unpinned('/data.bin'), 0, 9, {fingerprint: server.fingerprint});
        assert.deepStrictEqual(await read_all(rs), BODY.subarray(0, 10));
    });
    it('should return the requested range', async function () {
        const rs = await sftp_get_stream_range(server.url('/data.bin'), 10, 19);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 10, last: 19, total: BODY.length});
        assert.strictEqual(rs.total, BODY.length);
        assert.deepStrictEqual(await read_all(rs), BODY.subarray(10, 20));
    });
    it('should close the connection after the stream ends', async function () {
        const before = server.closed();
        const rs = await sftp_get_stream_range(server.url('/data.bin'), 0, 99);
        await read_all(rs);
        await wait_while(() => server.closed() === before);
    });
    it('should close the connection when the consumer destroys the stream early', async function () {
        const before = server.closed();
        const rs = await sftp_get_stream_range(server.url('/data.bin'), 0, BODY.length - 1);
        await new Promise(resolve => rs.once('data', resolve));
        rs.destroy();
        await wait_while(() => server.closed() === before);
    });
    [BODY.length, BODY.length + 1, 1024*1024].forEach(function (last) {
        it(`should cut a range that ends past the file [last=${last}] to its last byte`, async function () {
            const first = BODY.length - 10;
            const rs = await sftp_get_stream_range(server.url('/data.bin'), first, last);
            assert.deepStrictEqual(rs.content_range, {type: 'bytes', first, last: BODY.length - 1, total: BODY.length});
            assert.strictEqual(rs.total, BODY.length);
            assert.deepStrictEqual(await read_all(rs), BODY.subarray(first));
        });
    });
    it('should return the whole file for a range that is longer than the file', async function () {
        const before = server.closed();
        const rs = await sftp_get_stream_range(server.url('/data.bin'), 0, 1024*1024);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: 0, last: BODY.length - 1, total: BODY.length});
        assert.deepStrictEqual(await read_all(rs), BODY);
        await wait_while(() => server.closed() === before);
    });
    [-1, BODY.length, BODY.length + 1].forEach(function (first) {
        it(`should throw for a range that starts outside the file [first=${first}] and close the connection`, async function () {
            const before = server.closed();
            await assert.rejects(sftp_get_stream_range(server.url('/data.bin'), first, first + 9), /Invalid range/);
            await wait_while(() => server.closed() === before);
        });
    });
    it('should answer an empty file with an empty stream and close the connection before it is read', async function () {
        const before = server_empty.closed();
        const rs = await sftp_get_stream_range(server_empty.url('/data.bin'), 0, 1024*1024);
        assert.deepStrictEqual(rs.content_range, {type: 'bytes', first: null, last: null, total: 0});
        assert.strictEqual(rs.total, 0);
        await wait_while(() => server_empty.closed() === before);
        assert.deepStrictEqual(await read_all(rs), Buffer.alloc(0));
    });
    it('should throw for a range that starts past the start of an empty file and close the connection', async function () {
        const before = server_empty.closed();
        await assert.rejects(sftp_get_stream_range(server_empty.url('/data.bin'), 1, 10), /Invalid range/);
        await wait_while(() => server_empty.closed() === before);
    });
    it('should throw for a missing file', async function () {
        await assert.rejects(sftp_get_stream_range(server.url('/missing.bin'), 0, 1));
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
