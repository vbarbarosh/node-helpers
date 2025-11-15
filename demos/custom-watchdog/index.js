const HeartbeatServer = require('@vbarbarosh/node-helpers/src/HeartbeatServer');
const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const now_human = require('@vbarbarosh/node-helpers/src/now_human');
const pid_exists = require('@vbarbarosh/node-helpers/src/pid_exists');
const pid_kill_grace = require('@vbarbarosh/node-helpers/src/pid_kill_grace');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');

// Ctrl-C should gracefully terminate a child process and close heartbeat server
// Test
// - heartbeat server starts failed
// - heartbeat server does not close connection
// - heartbeat server sends 1G of data
// - child spawn failed
// - child receives no valid WATCHDOG_SOCKET
// - child does not send heartbeat
// - child spawns several children
// - watchdog has global timeout, child terminated earlier: watchdog should return immediately

cli(main);

async function main()
{
    const args = process.argv.slice(2);

    const heartbeat_server = new HeartbeatServer();
    try {
        console.log('socket_path', heartbeat_server.socket_path);
        const env = {...process.env, WATCHDOG_SOCKET: heartbeat_server.socket_path};
        const proc = await shell_spawn(args, {stdio: 'inherit', env}).init();
        try {
            heartbeat_server.on('heartbeat', () => console.log(`[${now_human()}] ❤️`))
            // ⚠️ An app will wail the entire `Promise.delay` before exiting!
            // await Promise.race([Promise.delay(10000), heartbeat_server.promise(), proc.promise()]);
            await Promise.race([heartbeat_server.promise(), proc.promise()]).timeout(10000);
        }
        finally {
            if (pid_exists(proc.pid)) {
                console.log('Terminating child process...');
                await pid_kill_grace(proc.pid, {
                    log: s => console.log(`[${now_human()}][pid_kill_grace] ${s}`),
                });
            }
        }
    }
    finally {
        console.log('Closing heartbeat server...');
        await heartbeat_server.dispose();
    }

    console.log('🎉 Done');
}
