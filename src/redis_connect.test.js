const assert = require('assert');
const child_process = require('child_process');
const fs = require('fs');
const fs_path_resolve = require('./fs_path_resolve');
const fs_path_tempdir = require('./fs_path_tempdir');
const fs_rmrf = require('./fs_rmrf');
const redis_connect = require('./redis_connect');
const tls = require('tls');

describe('redis_connect', function () {
    // A connection test needs a live redis server; this only guards against
    // the `redis` package going missing from optionalDependencies again.
    it('should be requirable without a live redis', function () {
        assert.strictEqual(typeof redis_connect, 'function');
    });

    // A stand-in that speaks enough of the redis protocol to be connected to:
    // it answers +OK to every command and keeps what it was sent. Its
    // certificate is self-signed, made by the openssl command for the run.
    describe('tls', function () {
        let cert, dir, received, server, url;

        before(async function () {
            dir = fs.mkdtempSync(fs_path_resolve(fs_path_tempdir(), 'vbtemp'));
            try {
                child_process.execFileSync('openssl', [
                    'req', '-x509', '-newkey', 'ec', '-pkeyopt', 'ec_paramgen_curve:prime256v1', '-nodes',
                    '-keyout', fs_path_resolve(dir, 'key.pem'), '-out', fs_path_resolve(dir, 'cert.pem'),
                    '-days', '2', '-subj', '/CN=redis.test', '-addext', 'subjectAltName=IP:127.0.0.1',
                ], {stdio: 'ignore'});
            }
            catch {
                // No openssl command on this machine: nothing to serve
                this.skip();
            }
            cert = fs.readFileSync(fs_path_resolve(dir, 'cert.pem'));
            received = [];
            server = tls.createServer({cert, key: fs.readFileSync(fs_path_resolve(dir, 'key.pem'))}, function (socket) {
                let pending = '';
                socket.on('error', function () {});
                socket.on('data', function (chunk) {
                    pending += chunk.toString('latin1');
                    for (let command = shift(); command; command = shift()) {
                        received.push(command.join(' '));
                        socket.write('+OK\r\n');
                    }
                });
                // *2\r\n$4\r\nAUTH\r\n$2\r\nPW\r\n -> ['AUTH', 'PW']
                function shift() {
                    const head = pending.match(/^\*(\d+)\r\n/);
                    if (!head) {
                        return null;
                    }
                    const out = [];
                    let pos = head[0].length;
                    for (let i = 0; i < Number(head[1]); ++i) {
                        const size = pending.slice(pos).match(/^\$(\d+)\r\n/);
                        if (!size || pending.length < pos + size[0].length + Number(size[1]) + 2) {
                            return null;
                        }
                        pos += size[0].length;
                        out.push(pending.slice(pos, pos + Number(size[1])));
                        pos += Number(size[1]) + 2;
                    }
                    pending = pending.slice(pos);
                    return out;
                }
            });
            await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
            url = `tls://127.0.0.1:${server.address().port}?password=PW`;
        });

        beforeEach(function () {
            received.length = 0;
        });

        after(async function () {
            if (server) {
                await new Promise(resolve => server.close(resolve));
            }
            await fs_rmrf(dir);
        });

        it('should refuse a certificate it cannot verify, before the password is sent', async function () {
            await assert.rejects(redis_connect(url), {code: 'DEPTH_ZERO_SELF_SIGNED_CERT'});
            assert.deepStrictEqual(received, []);
        });
        it('should connect when the caller supplies the certificate authority', async function () {
            const client = await redis_connect(url, {socket: {ca: cert}});
            try {
                assert.strictEqual(client.isReady, true);
                assert.strictEqual(received[0], 'AUTH PW');
            }
            finally {
                await client.disconnect();
            }
        });
        it('should refuse a certificate issued for another name', async function () {
            await assert.rejects(redis_connect(url, {socket: {ca: cert, servername: 'wrong.example'}}), {code: 'ERR_TLS_CERT_ALTNAME_INVALID'});
            assert.deepStrictEqual(received, []);
        });
        it('should skip only the name check for ssl[verify_peer_name]=0', async function () {
            const options = {socket: {servername: 'wrong.example'}};
            await assert.rejects(redis_connect(`${url}&ssl[verify_peer_name]=0`, options), {code: 'DEPTH_ZERO_SELF_SIGNED_CERT'});
            options.socket.ca = cert;
            const client = await redis_connect(`${url}&ssl[verify_peer_name]=0`, options);
            try {
                assert.strictEqual(client.isReady, true);
            }
            finally {
                await client.disconnect();
            }
        });
        it('should skip verification, with a warning, when the url says ssl[verify_peer]=0', async function () {
            const warnings = [];
            const listener = warning => warnings.push(warning);
            process.on('warning', listener);
            try {
                const client = await redis_connect(`${url}&ssl[verify_peer]=0`);
                try {
                    assert.strictEqual(client.isReady, true);
                    assert.strictEqual(received[0], 'AUTH PW');
                }
                finally {
                    await client.disconnect();
                }
                await new Promise(resolve => setImmediate(resolve));
                assert.deepStrictEqual(warnings.map(v => v.code), ['REDIS_CONNECT_TLS_NOT_VERIFIED']);
                assert.ok(!warnings[0].message.includes('PW'), warnings[0].message);
            }
            finally {
                process.off('warning', listener);
            }
        });
    });
});
