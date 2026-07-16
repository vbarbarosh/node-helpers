const assert = require('assert');
const sftp_get_stream_range = require('./sftp_get_stream_range');
const sftp_server_listen = require('./sftp_get_stream_range.d/sftp_server');
const wait_while = require('./wait_while');

const BODY = Buffer.from(Array.from({length: 100000}, (v, i) => i % 251));

describe('sftp_get_stream_range', function () {
    let server;
    before(async function () {
        server = await sftp_server_listen(BODY);
    });
    after(async function () {
        await server.close();
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
    it('should throw for an invalid range and close the connection', async function () {
        const before = server.closed();
        await assert.rejects(sftp_get_stream_range(server.url('/data.bin'), 0, BODY.length), /Invalid range/);
        await wait_while(() => server.closed() === before);
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
