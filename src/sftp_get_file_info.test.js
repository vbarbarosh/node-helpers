const assert = require('assert');
const sftp_get_file_info = require('./sftp_get_file_info');
const sftp_server_listen = require('./sftp_get_stream_range.d/sftp_server');
const wait_while = require('./wait_while');

describe('sftp_get_file_info', function () {
    let server;
    before(async function () {
        server = await sftp_server_listen(Buffer.from('hello'));
    });
    after(async function () {
        await server.close();
    });

    it('should return stat, lstat, and readdir', async function () {
        const info = await sftp_get_file_info(server.url('/'));
        assert.ok(info.stat.isDirectory());
        assert.ok(info.lstat.isDirectory());
        assert.strictEqual(info.readdir.length, 1);
        assert.strictEqual(info.readdir[0].filename, 'data.bin');
        assert.strictEqual(info.readdir[0].attrs.size, 5);
    });
    it('should close the connection after returning', async function () {
        const before = server.closed();
        await sftp_get_file_info(server.url('/'));
        await wait_while(() => server.closed() === before);
    });
    it('should accept a single argument', async function () {
        // A closed local port: the call must get past options destructuring
        // and fail with a connection error, not a TypeError.
        await assert.rejects(sftp_get_file_info('sftp://user:pass@127.0.0.1:9/x'), function (error) {
            assert(!(error instanceof TypeError), `got TypeError: ${error.message}`);
            return true;
        });
    });
    it('should throw on wrong credentials', async function () {
        await assert.rejects(sftp_get_file_info(server.url('/').replace(':pass1@', ':wrong@')));
    });
});
