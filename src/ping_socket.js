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
        const client = net.connect(socket_path);
        client.setTimeout(timeout_ms, () => finish(new Error('Socket Timeout')));
        client.on('end', () => finish(null, Buffer.concat(buf)))
        client.on('error', finish);
        client.on('connect', () => client.end(data));
        client.on('data', chunk => buf.push(chunk));
        function finish(error, out) {
            if (done) {
                return;
            }
            done = true;
            client.removeAllListeners();
            client.destroy();
            error ? reject(error) : resolve(out);
        }
    });
}

module.exports = ping_socket;
