const assert = require('assert');
const axios = require('axios');
const express = require('express');
const fs = require('fs');
const fs_path_resolve = require('./fs_path_resolve');
const fs_path_tempdir = require('./fs_path_tempdir');
const fs_rmrf = require('./fs_rmrf');
const http_stream_range = require('./http_stream_range');

describe('http_stream_range', function () {
    // 3,000,000 is deliberately not a multiple of the internal 2 MiB buffer:
    // the second read returns a short chunk, which used to come back padded
    // with garbage up to the full buffer size.
    const content = Buffer.alloc(3000000);
    for (let i = 0; i < content.length; ++i) {
        content[i] = i % 251;
    }

    let base, dir, server;

    before(function (done) {
        dir = fs.mkdtempSync(fs_path_resolve(fs_path_tempdir(), 'vbtemp'));
        const file = fs_path_resolve(dir, 'data.bin');
        fs.writeFileSync(file, content);
        const app = express();
        app.get('/file', (req, res) => http_stream_range(req, res, file));
        server = app.listen(0, function () {
            base = `http://127.0.0.1:${server.address().port}`;
            done();
        });
    });

    after(async function () {
        await new Promise(resolve => server.close(resolve));
        await fs_rmrf(dir);
    });

    it('should stream the whole file', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer'});
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers['content-length'], String(content.length));
        assert(content.equals(Buffer.from(res.data)));
    });
    it('should serve a range', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer', headers: {Range: 'bytes=10-49'}});
        assert.strictEqual(res.status, 206);
        assert.strictEqual(res.headers['content-range'], `bytes 10-49/${content.length}`);
        assert.strictEqual(res.headers['content-length'], '40');
        assert(content.subarray(10, 50).equals(Buffer.from(res.data)));
    });
    it('should serve a range spanning the internal buffer boundary', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer', headers: {Range: 'bytes=2097000-2247000'}});
        assert.strictEqual(res.status, 206);
        assert.strictEqual(res.headers['content-length'], '150001');
        assert(content.subarray(2097000, 2247001).equals(Buffer.from(res.data)));
    });
    it('should serve an open-ended range', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer', headers: {Range: 'bytes=2999900-'}});
        assert.strictEqual(res.status, 206);
        assert.strictEqual(res.headers['content-range'], `bytes 2999900-2999999/${content.length}`);
        assert(content.subarray(2999900).equals(Buffer.from(res.data)));
    });
    it('should serve a suffix range', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer', headers: {Range: 'bytes=-100'}});
        assert.strictEqual(res.status, 206);
        assert.strictEqual(res.headers['content-range'], `bytes 2999900-2999999/${content.length}`);
        assert(content.subarray(2999900).equals(Buffer.from(res.data)));
    });
    it('should respond to HEAD with Content-Length and no body', async function () {
        const res = await axios.head(`${base}/file`);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers['content-length'], String(content.length));
    });
    it('should advertise Accept-Ranges on GET and HEAD', async function () {
        const get = await axios.get(`${base}/file`, {responseType: 'arraybuffer'});
        const head = await axios.head(`${base}/file`);
        assert.strictEqual(get.headers['accept-ranges'], 'bytes');
        assert.strictEqual(head.headers['accept-ranges'], 'bytes');
    });
    it('should ignore a Range expression it cannot parse (RFC 7233)', async function () {
        const res = await axios.get(`${base}/file`, {responseType: 'arraybuffer', headers: {Range: 'items=0-9'}});
        assert.strictEqual(res.status, 200);
        assert(content.equals(Buffer.from(res.data)));
    });
    it('should respond 416 to an unsatisfiable range', async function () {
        const res = await axios.get(`${base}/file`, {headers: {Range: 'bytes=99999999-'}, validateStatus: () => true});
        assert.strictEqual(res.status, 416);
        assert.strictEqual(res.headers['content-range'], `bytes */${content.length}`);
    });
});
