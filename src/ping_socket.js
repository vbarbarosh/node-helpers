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
        const client = net.connect(socket_path);
        client.setEncoding('utf8');
        client.setTimeout(timeout_ms, () => finish(new Error('Timeout')));
        client.on('error', finish);
        client.on('connect', () => client.end(data));
        client.on('data', chunk => finish(null, chunk));
        function finish(error, result) {
            if (done) {
                return;
            }
            done = true;
            client.destroy();
            error ? reject(error) : resolve(result);
        }
    });
}

module.exports = ping_socket;
