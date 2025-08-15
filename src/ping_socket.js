const Promise = require('bluebird');
const net = require('net');

/**
 * - Always closes the socket.
 * - Throws on any error or timeout.
 * - Doesn’t hang if the server sends nothing.
 */
function ping_socket(socket_path, data = 'PING', timeout_ms = 1000)
{
    return new Promise(function (resolve, reject) {
        let done = false;
        const buf = [];
        const socket = net.connect(socket_path);
        socket.setTimeout(timeout_ms, () => finish(new Error('Socket Timeout')));
        socket.on('end', () => finish(null, Buffer.concat(buf)))
        socket.on('error', finish);
        socket.on('connect', () => socket.end(data));
        socket.on('data', chunk => buf.push(chunk));
        function finish(error, out) {
            if (done) {
                return;
            }
            done = true;
            socket.removeAllListeners();
            socket.destroy();
            error ? reject(error) : resolve(out);
        }
    });
}

module.exports = ping_socket;
