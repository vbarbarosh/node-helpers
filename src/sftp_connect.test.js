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
    it('should connect when no fingerprint is given, as up to v3.79.2, with a warning that names the host key', async function () {
        const fresh = await sftp_server_listen(Buffer.from('hello'));
        try {
            const warnings = await warnings_of(async function () {
                const conn = await sftp_connect(fresh.url_unpinned('/'));
                conn.end();
            });
            assert.deepStrictEqual(warnings.map(v => v.code), ['SFTP_HOST_KEY_NOT_VERIFIED']);
            assert.ok(warnings[0].message.includes(`add fingerprint=${fresh.fingerprint} to the url`), warnings[0].message);
            assert.ok(!warnings[0].message.includes('pass1'), warnings[0].message);
        }
        finally {
            await fresh.close();
        }
    });
    it('should take an empty fingerprint as none given', async function () {
        for (const fingerprint of ['', [], null]) {
            const conn = await sftp_connect(server.url_unpinned('/'), {fingerprint});
            conn.end();
        }
        const conn = await sftp_connect(`${server.url_unpinned('/')}?fingerprint=`);
        conn.end();
    });
    it('should warn once for a server, however many connections go to it, and again for another server', async function () {
        const a = await sftp_server_listen(Buffer.from('hello'));
        const b = await sftp_server_listen(Buffer.from('hello'));
        try {
            const warnings = await warnings_of(async function () {
                const conns = await Promise.all([a, a, a, a, b].map(v => sftp_connect(v.url_unpinned('/'))));
                conns.forEach(v => v.end());
                const conn = await sftp_connect(a.url_unpinned('/'));
                conn.end();
            });
            assert.strictEqual(warnings.length, 2, warnings.map(v => v.message).join('\n'));
            assert.notStrictEqual(warnings[0].message, warnings[1].message);
        }
        finally {
            await a.close();
            await b.close();
        }
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
    it('should accept any host key for fingerprint=any, with one warning for a server', async function () {
        const fresh = await sftp_server_listen(Buffer.from('hello'));
        try {
            const warnings = await warnings_of(async function () {
                for (let i = 0; i < 3; ++i) {
                    const conn = await sftp_connect(`${fresh.url_unpinned('/')}?fingerprint=any`);
                    conn.end();
                }
            });
            assert.deepStrictEqual(warnings.map(v => v.code), ['SFTP_HOST_KEY_NOT_VERIFIED']);
            assert.ok(!warnings[0].message.includes('pass1'), warnings[0].message);
        }
        finally {
            await fresh.close();
        }
    });
    it('should reject on wrong credentials once the host key is verified', async function () {
        await assert.rejects(sftp_connect(server.url('/').replace(':pass1@', ':wrong@')), /authentication/i);
    });
});

// The process warnings emitted while fn runs
async function warnings_of(fn)
{
    const out = [];
    const listener = warning => out.push(warning);
    process.on('warning', listener);
    try {
        await fn();
        // A warning is delivered on the next tick
        await new Promise(resolve => setImmediate(resolve));
    }
    finally {
        process.off('warning', listener);
    }
    return out;
}
