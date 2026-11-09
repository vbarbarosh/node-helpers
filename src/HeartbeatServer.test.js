const HeartbeatServer = require('./HeartbeatServer');
const assert = require('assert');
const fs = require('fs');
const fs_assert_file_socket = require('./fs_assert_file_socket');
const fs_path_dirname = require('./fs_path_dirname');
const net = require('net');
const ping_socket = require('./ping_socket');
const wait_while = require('./wait_while');

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

    it('should use unique socket paths for instances created in the same second', async function () {
        const a = new HeartbeatServer();
        const b = new HeartbeatServer();
        try {
            assert.notStrictEqual(b.socket_path, a.socket_path);
            await fs_assert_file_socket(a.socket_path);
            await fs_assert_file_socket(b.socket_path);
            await ping_socket(b.socket_path);
        }
        finally {
            await a.dispose();
            await b.dispose();
        }
    });
    it('should reject the internal promise on dispose', async function () {
        const server = new HeartbeatServer();
        await fs_assert_file_socket(server.socket_path);
        const rejected = assert.rejects(server.promise(), /Server Closed/);
        await server.dispose();
        await rejected;
    });
    it('should dispose safely before the server starts listening, and twice', async function () {
        const server = new HeartbeatServer();
        await server.dispose();
        await server.dispose();
    });
    it('should dispose safely when listen failed', async function () {
        const a = new HeartbeatServer();
        try {
            // Same process + same second → same socket path → EADDRINUSE.
            // (If the paths ever become unique, b just starts normally and
            // only the idempotence below is exercised.)
            const b = new HeartbeatServer();
            if (b.socket_path === a.socket_path) {
                await assert.rejects(b.promise(), /Server Failed/);
            }
            await b.dispose();
            await b.dispose();
        }
        finally {
            await a.dispose();
        }
    });
    it('should count only an exact PING frame as a heartbeat', async function () {
        const server = new HeartbeatServer();
        try {
            let heartbeats = 0;
            const warnings = [];
            server.on('heartbeat', () => heartbeats++);
            server.on('warning', e => warnings.push(e.message));
            await fs_assert_file_socket(server.socket_path);
            // an empty connection, a partial frame, extra bytes, another word
            for (const data of ['', 'PIN', 'PINGPING', 'PING PING', 'ping', 'PONG']) {
                await ping_socket(server.socket_path, data);
            }
            await wait_while(() => warnings.length < 6);
            assert.strictEqual(heartbeats, 0);
            assert.ok(warnings.every(v => /Not a heartbeat/.test(v)), JSON.stringify(warnings));
            // the frame itself, also as `echo PING` sends it
            await ping_socket(server.socket_path, 'PING');
            await ping_socket(server.socket_path, 'PING\n');
            await wait_while(() => heartbeats < 2);
            assert.strictEqual(heartbeats, 2);
            assert.strictEqual(warnings.length, 6);
        }
        finally {
            await server.dispose();
        }
    });
    it('should not be kept alive by empty connections', async function () {
        const server = new HeartbeatServer(100);
        try {
            server.on('warning', function () {});
            await fs_assert_file_socket(server.socket_path);
            const socket_path = server.socket_path;
            const timer = setInterval(() => ping_socket(socket_path, '').catch(function () {}), 20);
            try {
                await assert.rejects(server.promise(), /No heartbeat/);
            }
            finally {
                clearInterval(timer);
            }
        }
        finally {
            await server.dispose();
        }
    });
    it('should keep its socket to the user who runs it, and leave nothing behind', async function () {
        const server = new HeartbeatServer();
        const socket_path = server.socket_path;
        const dir = fs_path_dirname(socket_path);
        try {
            await fs_assert_file_socket(socket_path);
            assert.strictEqual(fs.statSync(socket_path).mode & 0o777, 0o600);
            assert.strictEqual(fs.statSync(dir).mode & 0o777, 0o700);
        }
        finally {
            await server.dispose();
        }
        assert.strictEqual(fs.existsSync(socket_path), false);
        assert.strictEqual(fs.existsSync(dir), false);
    });
    it('should emit a "warning" event when a client floods', async function () {
        const server = new HeartbeatServer();
        try {
            const warnings = [];
            server.on('warning', e => warnings.push(e));
            await fs_assert_file_socket(server.socket_path);
            const client = net.connect(server.socket_path);
            await new Promise(resolve => client.on('connect', resolve));
            client.on('error', function () {}); // the server destroys the socket mid-write
            client.write(Buffer.alloc(2*1024*1024));
            await wait_while(() => warnings.length === 0);
            assert.match(warnings[0].message, /floods/);
            client.destroy();
        }
        finally {
            await server.dispose();
        }
    });
    it('should reject when no heartbeat received in an expected interval', async function () {
        const server = new HeartbeatServer(50);
        try {
            await assert.rejects(server.promise(), function (error) {
                return error.exit_code === 124 && /No heartbeat/.test(error.message);
            });
        }
        finally {
            await server.dispose();
        }
    });
    it('should not send any heartbeat signals after rejection', async function () {
        const server = new HeartbeatServer(50);
        try {
            let heartbeats = 0;
            server.on('heartbeat', () => heartbeats++);
            const socket_path = server.socket_path;
            await assert.rejects(server.promise());
            // The watchdog disposed itself: the socket is gone, and no
            // heartbeat may have been emitted along the way.
            await assert.rejects(ping_socket(socket_path));
            assert.strictEqual(heartbeats, 0);
        }
        finally {
            await server.dispose();
        }
    });
});
