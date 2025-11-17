const HeartbeatServer = require('./HeartbeatServer');
const assert = require('assert');
const fs_assert_file_socket = require('./fs_assert_file_socket');
const ping_socket = require('./ping_socket');

// 💎 Only the lack of a valid PING within WATCHDOG_INTERVAL is fatal

// 📕 Notes by ChatGPT
// If listen() fails (EADDRINUSE, perms, etc.), constructor will throw,
// and heartbeat_server will be undefined in finally { await heartbeat_server.dispose() }.

describe('HeartbeatServer', function () {
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

    // should emit a "warning" event on any client errors
    // should not send any heartbeat signals after rejection (decision to kill a child process)
    // should reject when no heartbeat received in an expected interval
});
