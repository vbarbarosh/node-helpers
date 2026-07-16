const assert = require('assert');
const fs = require('fs');
const fs_path_join = require('./fs_path_join');
const fs_tempdir = require('./fs_tempdir');
const http = require('http');
const http_put_file = require('./http_put_file');

describe('http_put_file', function () {
    let server;
    let base;
    before(async function () {
        server = http.createServer(function (request, response) {
            const chunks = [];
            request.on('data', chunk => chunks.push(chunk));
            request.on('end', function () {
                switch (request.url) {
                case '/200':
                    response.writeHead(200);
                    response.end(Buffer.concat(chunks));
                    break;
                case '/201':
                    response.writeHead(201);
                    response.end('created');
                    break;
                case '/204':
                    response.writeHead(204);
                    response.end();
                    break;
                default:
                    response.writeHead(404, 'Not Found');
                    response.end('no such route');
                    break;
                }
            });
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        base = `http://127.0.0.1:${server.address().port}`;
    });
    after(function () {
        server.close();
    });

    it('should resolve on 200 and return the response body', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_join(d, 'file.txt');
            await fs.promises.writeFile(file, 'hello');
            const {response, data} = await http_put_file(`${base}/200`, file);
            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(data.toString('utf8'), 'hello');
        });
    });
    it('should resolve on 201', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_join(d, 'file.txt');
            await fs.promises.writeFile(file, 'hello');
            const {response} = await http_put_file(`${base}/201`, file);
            assert.strictEqual(response.statusCode, 201);
        });
    });
    it('should resolve on 204', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_join(d, 'file.txt');
            await fs.promises.writeFile(file, 'hello');
            const {response, data} = await http_put_file(`${base}/204`, file);
            assert.strictEqual(response.statusCode, 204);
            assert.strictEqual(data.length, 0);
        });
    });
    it('should throw on 404 and include the response body', async function () {
        await fs_tempdir(async function (d) {
            const file = fs_path_join(d, 'file.txt');
            await fs.promises.writeFile(file, 'hello');
            await assert.rejects(http_put_file(`${base}/nope`, file), /404 Not Found[\s\S]*no such route/);
        });
    });
    it('should throw when the file cannot be read', async function () {
        await fs_tempdir(async function (d) {
            // A directory passes the initial fs_size call, but reading it
            // fails with EISDIR once the request is already in flight
            await assert.rejects(http_put_file(`${base}/200`, d), /EISDIR/);
        });
    });
});
