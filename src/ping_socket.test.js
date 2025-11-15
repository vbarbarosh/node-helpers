const Promise = require('bluebird');
const assert = require('assert');
const fs_rmf = require('./fs_rmf');
const net = require('net');
const ping_socket = require('./ping_socket');
const random_hex = require('./random_hex');

const socket = '/tmp/ping_socket_test.sock';

describe.only('ping_socket', function () {

    afterEach(async function () {
        await fs_rmf(socket);
    });

    it('should receive exact string from server', async function () {
        const uid = random_hex();
        await using server = net.createServer(client => client.resume().end(uid));
        await new Promise(resolve => server.listen(socket, resolve));
        const buf = await ping_socket(socket);
        assert.strictEqual(buf.toString(), uid);
    });

    it('should throw Socket Timeout', async function () {
        await using server = net.createServer(client => client.resume());
        await new Promise(resolve => server.listen(socket, resolve));
        await assert.rejects(ping_socket(socket, 'PING', 100), {message: 'Socket Timeout'});
    });

    it('should throw ENOENT', async function () {
        await assert.rejects(ping_socket(socket), {
            code: 'ENOENT',
            syscall: 'connect',
            address: socket,
        });
    });
});
