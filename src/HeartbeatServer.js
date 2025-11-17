const EventEmitter = require('events');
const ExitCodeError = require('./errors/ExitCodeError');
const Promise = require('bluebird');
const fs = require('fs');
const fs_path_join = require('./fs_path_join');
const fs_rmf = require('./fs_rmf');
const net = require('net');
const now_fs = require('./now_fs');
const os = require('os');

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

        // Put socket on tmpfs to avoid slow disks.
        this.#socket_path = fs.existsSync('/dev/shm')
            ? fs_path_join('/dev/shm', `watchdog-${process.pid}-${now_fs()}.sock`)
            : fs_path_join(os.tmpdir(), `watchdog-${process.pid}-${now_fs()}.sock`);

        this.#promise = new Promise((resolve, reject) => {
            this.#reject = reject;
        });

        this.#server = net.createServer(function (client) {
            let bytes_received = 0;
            client.setEncoding('utf8');
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
                _this.#last_ping = Date.now();
                _this.emit('heartbeat');
            });
            client.on('data', function (buf) {
                if (!_this.#server) {
                    return;
                }
                // Not really interested in any data
                bytes_received += buf.length;
                if (bytes_received > 1024*1024) {
                    _this.emit('warning', new Error(`Client floods. Bytes recieved: ${bytes_received}`));
                    client.destroy();
                }
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
        try {
            const _this = this;
            await new Promise(function (resolve, reject) {
                _this.#server.removeAllListeners();
                _this.#server.close(error => error ? reject(error) : resolve());
                _this.#server = null;
            });
        }
        finally {
            await fs_rmf(this.#socket_path);
            this.#socket_path = null;
        }
    }
}

module.exports = HeartbeatServer;
