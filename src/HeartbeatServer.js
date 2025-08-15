const EventEmitter = require('events');
const Promise = require('bluebird');
const fs = require('fs');
const fs_path_join = require('./fs_path_join');
const fs_rmf = require('./fs_rmf');
const net = require('net');
const now_fs = require('./now_fs');
const os = require('os');

class HeartbeatServer extends EventEmitter
{
    #socket_path;
    #last_ping = Date.now();
    #interval_ms;
    #promise;
    #reject;
    #timer;
    #server;

    constructor(interval_ms) {
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

        this.#server = net.createServer(function (socket) {
            socket.setEncoding('utf8');
            socket.on('error', function (error) {
                _this.#reject(new Error(`Client Socket Failed: ${error.message}`));
            });
            socket.on('end', function () {
                _this.#last_ping = Date.now();
                _this.emit('heartbeat');
            });
            socket.on('data', function () {
                // Not really interested in any data
            });
            socket.end('OK');
        });
        this.#server.on('error', function (error) {
            _this.#reject(new Error(`Server Failed: ${error.message}`));
        });
        this.#server.on('close', function () {
            _this.#reject(new Error(`Server Closed`));
        });
        this.#server.listen(this.#socket_path, function () {
            // started = true;
        });
    }

    #tick() {
        if (this.#last_ping + this.#interval_ms < Date.now()) {
            clearInterval(this.#timer);
            this.#timer = null;
            this.#reject(new Error(`No heartbeat for the last ${this.#interval_ms}ms`));
        }
    }

    get socket_path() {
        return this.#socket_path;
    }

    promise() {
        return this.#promise;
    }

    async dispose() {
        if (this.#timer) {
            clearInterval(this.#timer);
            this.#timer = null;
        }
        try {
            const _this = this;
            await new Promise(function (resolve, reject) {
                _this.#server.removeAllListeners();
                _this.#server.close(error => error ? reject(error) : resolve());
            });
        }
        finally {
            await fs_rmf(this.#socket_path);
        }
    }
}

module.exports = HeartbeatServer;
