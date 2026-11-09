const EventEmitter = require('events');
const ExitCodeError = require('./errors/ExitCodeError');
const Promise = require('bluebird');
const fs = require('fs');
const fs_path_dirname = require('./fs_path_dirname');
const fs_path_join = require('./fs_path_join');
const fs_rmf = require('./fs_rmf');
const ignore = require('./ignore');
const net = require('net');
const os = require('os');

// A heartbeat is this frame and nothing else; `echo PING` adds a newline
const PING = 'PING';
const PING_MAX_BYTES = 64;

// 💎 Only the lack of a valid PING within WATCHDOG_INTERVAL is fatal
class HeartbeatServer extends EventEmitter
{
    #socket_path;
    #last_ping = Date.now();
    #interval_ms;
    #promise;
    #reject;
    #timer;
    #server;

    constructor(interval_ms = 5000) {
        super();
        this.#interval_ms = interval_ms;
        this.#init();
    }

    #init() {
        const _this = this;

        this.#timer = setInterval(() => this.#tick(), this.#interval_ms);

        // Put socket on tmpfs to avoid slow disks, in a directory of its own
        // that only this user can enter (mkdtemp makes it with mode 0700):
        // the path is unique per instance, and no other local user can reach
        // the socket, whatever the umask
        const dir = fs.mkdtempSync(fs_path_join(fs.existsSync('/dev/shm') ? '/dev/shm' : os.tmpdir(), 'watchdog-'));
        this.#socket_path = fs_path_join(dir, 'heartbeat.sock');

        this.#promise = new Promise((resolve, reject) => {
            this.#reject = reject;
        });
        // A clean dispose rejects the internal promise: without a handler of
        // our own that raises an unhandled rejection when nobody awaits promise()
        this.#promise.catch(ignore);

        this.#server = net.createServer(function (client) {
            let bytes_received = 0;
            let payload = '';
            client.setEncoding('utf8');
            // A client that connects and then says nothing is not a heartbeat
            // either: it is dropped once a whole interval has passed
            client.setTimeout(_this.#interval_ms, () => client.destroy());
            client.on('error', function (error) {
                if (!_this.#server) {
                    return;
                }
                _this.emit('warning', error);
            });
            client.on('end', function () {
                if (!_this.#server) {
                    return;
                }
                if (payload.trimEnd() !== PING) {
                    _this.emit('warning', new Error(`Not a heartbeat: expected ${PING}, received ${bytes_received} bytes`));
                    return;
                }
                _this.#last_ping = Date.now();
                _this.emit('heartbeat');
            });
            client.on('data', function (buf) {
                if (!_this.#server) {
                    return;
                }
                bytes_received += buf.length;
                if (bytes_received > PING_MAX_BYTES) {
                    _this.emit('warning', new Error(`Client floods. Bytes recieved: ${bytes_received}`));
                    client.destroy();
                    return;
                }
                payload += buf;
            });
            client.end('OK');
        });
        this.#server.on('error', function (error) {
            _this.#reject(new Error(`Server Failed: ${error.message}`));
        });
        this.#server.on('close', function () {
            _this.#reject(new Error('Server Closed'));
        });
        this.#server.listen(this.#socket_path, function () {
            // started = true;
            try {
                fs.chmodSync(_this.#socket_path, 0o600);
            }
            catch {
                // disposed in the meantime: the socket is gone
            }
        });
    }

    async #tick() {
        if (this.#last_ping + this.#interval_ms < Date.now()) {
            clearInterval(this.#timer);
            this.#timer = null;
            this.#reject(new ExitCodeError(124, `No heartbeat for the last ${this.#interval_ms}ms`));
            await this.dispose();
        }
    }

    get socket_path() {
        return this.#socket_path;
    }

    promise() {
        return this.#promise;
    }

    // - Stops the watchdog
    // - Closes socket
    // - Removes socket file
    // - Rejects the internal promise with a "Server Closed" error
    // - Safe to call multiple times (idempotent)
    async dispose() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = null;
        }
        if (!this.#server) {
            return;
        }
        // removeAllListeners below also removes the 'close' handler which
        // would have rejected: reject explicitly, as documented
        this.#reject(new Error('Server Closed'));
        try {
            const _this = this;
            await new Promise(function (resolve, reject) {
                _this.#server.removeAllListeners();
                _this.#server.close(function (error) {
                    // close() reports ERR_SERVER_NOT_RUNNING when listen
                    // never completed (failed or still pending): dispose is
                    // documented idempotent, "nothing to close" is not an error
                    if (error && error.code !== 'ERR_SERVER_NOT_RUNNING') {
                        reject(error);
                        return;
                    }
                    resolve();
                });
                _this.#server = null;
            });
        }
        finally {
            await fs_rmf(this.#socket_path);
            await fs.promises.rmdir(fs_path_dirname(this.#socket_path)).catch(ignore);
            this.#socket_path = null;
        }
    }
}

module.exports = HeartbeatServer;
