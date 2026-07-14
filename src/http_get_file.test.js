const assert = require('assert');
const fs_exists = require('./fs_exists');
const fs_path_resolve = require('./fs_path_resolve');
const fs_read_utf8 = require('./fs_read_utf8');
const fs_tempdir = require('./fs_tempdir');
const http = require('http');
const http_get_file = require('./http_get_file');

describe('http_get_file', function () {
    let base, server;

    before(function (done) {
        server = http.createServer(function (req, res) {
            switch (req.url) {
            case '/ok':
                res.end('hello world');
                break;
            case '/abort':
                res.setHeader('Content-Length', 1000000);
                res.write('partial');
                setTimeout(() => res.destroy(), 10);
                break;
            default:
                res.statusCode = 404;
                res.end();
                break;
            }
        });
        server.listen(0, function () {
            base = `http://127.0.0.1:${server.address().port}`;
            done();
        });
    });

    after(function (done) {
        server.close(done);
    });

    it('should download a file', async function () {
        await fs_tempdir(async function (d) {
            const out_file = fs_path_resolve(d, 'out.bin');
            await http_get_file(`${base}/ok`, out_file);
            assert.strictEqual(await fs_read_utf8(out_file), 'hello world');
        });
    });
    it('should reject when the server aborts the download', async function () {
        await fs_tempdir(async function (d) {
            await assert.rejects(http_get_file(`${base}/abort`, fs_path_resolve(d, 'out.bin')));
        });
    });
    it('should reject when out_file is not writable', async function () {
        await assert.rejects(http_get_file(`${base}/ok`, '/nonexistent-dir-xyz/out.bin'), /ENOENT/);
    });
    it('should not create out_file on an http error status', async function () {
        await fs_tempdir(async function (d) {
            const out_file = fs_path_resolve(d, 'out.bin');
            await assert.rejects(http_get_file(`${base}/missing`, out_file), /404/);
            assert.strictEqual(await fs_exists(out_file), false);
        });
    });
});
