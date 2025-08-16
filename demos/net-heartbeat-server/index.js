const HeartbeatServer = require('../../src/HeartbeatServer');
const Promise = require('bluebird');
const cli = require('../../src/cli');
const now_atom = require('../../src/now_atom');
const ping_socket = require('../../src/ping_socket');

cli(main);

async function main()
{
    const timer = setInterval(tick, 900);
    const heartbeat_server = new HeartbeatServer();
    try {
        console.log('socket_path', heartbeat_server.socket_path);
        heartbeat_server.on('heartbeat', () => console.log(`[${now_atom()}] heartbeat`))
        await Promise.race([Promise.delay(10000), heartbeat_server.promise()]);
    }
    finally {
        clearInterval(timer);
        await heartbeat_server.dispose();
    }
    console.log('🎉 Done');

    async function tick() {
        console.log(await ping_socket(heartbeat_server.socket_path));
    }
}
