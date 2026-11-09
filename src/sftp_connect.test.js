const assert = require('assert');
const sftp_connect = require('./sftp_connect');
const sftp_server_listen = require('./sftp_get_stream_range.d/sftp_server');

describe('sftp_connect', function () {
    let server;
    before(async function () {
        server = await sftp_server_listen(Buffer.from('hello'));
    });
    after(async function () {
        await server.close();
    });

    it('should connect when the url carries the fingerprint of the host key', async function () {
        const conn = await sftp_connect(server.url('/'));
        conn.end();
    });
    it('should connect when the fingerprint comes in the options, also as one of several', async function () {
        const conn = await sftp_connect(server.url_unpinned('/'), {fingerprint: ['SHA256:AAAA', server.fingerprint]});
        conn.end();
    });
    it('should accept a fingerprint whose "+" was not percent-encoded', async function () {
        const conn = await sftp_connect(`${server.url_unpinned('/')}?fingerprint=${server.fingerprint}`);
        conn.end();
    });
    it('should refuse a host key that is not pinned, name it, and send no password', async function () {
        const logins = server.logins();
        await assert.rejects(sftp_connect(server.url_unpinned('/')), function (error) {
            assert.strictEqual(error.code, 'ERR_SFTP_HOST_KEY_NOT_PINNED');
            assert.strictEqual(error.fingerprint, server.fingerprint);
            assert.ok(error.message.includes(`add fingerprint=${server.fingerprint} to the url`), error.message);
            assert.ok(!error.message.includes('pass1'), error.message);
            return true;
        });
        assert.strictEqual(server.logins(), logins);
    });
    it('should refuse a host key that does not match, and send no password', async function () {
        const logins = server.logins();
        await assert.rejects(sftp_connect(server.url_unpinned('/'), {fingerprint: 'SHA256:AAAA'}), function (error) {
            assert.strictEqual(error.code, 'ERR_SFTP_HOST_KEY_MISMATCH');
            assert.strictEqual(error.fingerprint, server.fingerprint);
            return true;
        });
        assert.strictEqual(server.logins(), logins);
    });
    it('should accept any host key, with a warning, for fingerprint=any', async function () {
        const warnings = [];
        const listener = warning => warnings.push(warning);
        process.on('warning', listener);
        try {
            const conn = await sftp_connect(`${server.url_unpinned('/')}?fingerprint=any`);
            conn.end();
            await new Promise(resolve => setImmediate(resolve));
            assert.deepStrictEqual(warnings.map(v => v.code), ['SFTP_HOST_KEY_NOT_VERIFIED']);
            assert.ok(!warnings[0].message.includes('pass1'), warnings[0].message);
        }
        finally {
            process.off('warning', listener);
        }
    });
    it('should reject on wrong credentials once the host key is verified', async function () {
        await assert.rejects(sftp_connect(server.url('/').replace(':pass1@', ':wrong@')), /authentication/i);
    });
});
