const HeartbeatServer = require('./HeartbeatServer');
const assert = require('assert');
const fs_assert_file_socket = require('./fs_assert_file_socket');
const ping_socket = require('./ping_socket');

describe.only('HeartbeatServer', function () {
    it('Happy Path', async function () {
        const server = new HeartbeatServer();
        try {
            let counter = 0;
            server.on('heartbeat', () => counter++);
            await fs_assert_file_socket(server.socket_path);
            await ping_socket(server.socket_path);
            await ping_socket(server.socket_path);
            assert.strictEqual(counter, 2);
        }
        finally {
            await server.dispose();
        }
    });

    // - timeout when no heartbeat received in expected interval
    // - throw "Server Closed" when calling server.dispose()
});
