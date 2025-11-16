const Promise = require('bluebird');
const assert = require('assert');
const fs_rmf = require('./fs_rmf');
const net = require('net');
const ping_socket = require('./ping_socket');
const random_hex = require('./random_hex');

const socket = '/tmp/ping_socket_test.sock';

describe('ping_socket', function () {

    afterEach(async function () {
        await fs_rmf(socket);
    });

    it('should receive exact string from server', async function () {
        const uid = random_hex();
        const server = net.createServer(client => client.resume().end(uid));
        try {
            await new Promise(resolve => server.listen(socket, resolve));
            const buf = await ping_socket(socket);
            assert.strictEqual(buf.toString(), uid);
        }
        finally {
            await server_close(server);
        }
    });

    it('should throw Socket Timeout', async function () {
        const clients = [];
        const server = net.createServer(client => clients.push(client));
        try {
            await new Promise(resolve => server.listen(socket, resolve));
            await assert.rejects(ping_socket(socket, 'PING', 100), {message: 'Socket Timeout'});
        }
        finally {
            clients.forEach(v => v.resume().end());
            await server_close(server);
        }
    });

    it('should throw ENOENT', async function () {
        await assert.rejects(ping_socket(socket), {
            code: 'ENOENT',
            syscall: 'connect',
            address: socket,
        });
    });
});

async function server_close(server)
{
    return new Promise(function (resolve, reject) {
        server.close(function (error) {
            error ? reject(error) : resolve();
        });
    });
}
