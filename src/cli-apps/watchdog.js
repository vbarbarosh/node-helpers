#!/usr/bin/env node

const ExitCodeError = require('../errors/ExitCodeError');
const HeartbeatServer = require('../HeartbeatServer');
const Promise = require('bluebird');
const cli = require('../cli');
const cuid = require('@paralleldrive/cuid2');
const make = require('@vbarbarosh/type-helpers/src/make');
const now_human = require('../now_human');
const pgid_exists = require('../pgid_exists');
const pgid_kill_grace = require('../pgid_kill_grace');
const shell_spawn = require('../shell_spawn');

const LOGS_ROOT_UID = cuid.createId();

// 💎 Only the lack of a valid PING within WATCHDOG_INTERVAL is fatal

// Ctrl-C should gracefully terminate a child process and close heartbeat server
// Test
// - heartbeat server starts failed
// - heartbeat server does not close connection
// - heartbeat server sends 1G of data
// - child spawn failed
// - child receives no valid WATCHDOG_SOCKET
// - child does not send heartbeat
// - child spawns several children (watchdog → child → subchild → subsubchild)
// - watchdog has global timeout, child terminated earlier: watchdog should return immediately

cli(main, report);

function report(error)
{
    log(`[heartbeat_end_error] ${error.message}`);
}

async function main()
{
    const args = process.argv.slice(2);
    if (!args.length) {
        usage();
        process.exit(1);
    }

    log('[heartbeat_begin]');

    const WATCHDOG_INTERVAL = make(process.env.WATCHDOG_INTERVAL, {type: 'int', min: 1000, default: 5000});
    const heartbeat_server = new HeartbeatServer(WATCHDOG_INTERVAL);
    const WATCHDOG_SOCKET = heartbeat_server.socket_path;
    heartbeat_server.on('heartbeat', () => log('[heartbeat_ping] ❤️'))
    heartbeat_server.on('warning', error => log(`[heartbeat_warn] ⚠️ ${error}`))

    try {
        log(`[heartbeat_socket_path] ${heartbeat_server.socket_path}`);
        const env = {...process.env, WATCHDOG_INTERVAL, WATCHDOG_SOCKET};
        const proc = await shell_spawn(args, {stdio: 'inherit', env, detached: true}).init();
        const pgid = proc.pid; // group id == leader pid

        const signal = new Promise(function (resolve, reject) {
            process.on('SIGTERM', function () {
                log('[heartbeat_sigterm]');
                reject(new ExitCodeError(143, 'SIGTERM'));
            });
            process.on('SIGINT', function () {
                log('[heartbeat_sigint]');
                reject(new ExitCodeError(130, 'SIGINT'));
            });
        });

        try {
            await Promise.race([signal, heartbeat_server.promise(), proc.promise()]);
            // happy path
        }
        finally {
            if (pgid_exists(pgid)) {
                await pgid_kill_grace(pgid, {
                    log: s => log(`[heartbeat_pgid_kill_grace] ${s}`),
                });
            }
        }
    }
    finally {
        log('[heartbeat_dispose] Closing heartbeat server...');
        await Promise.resolve(heartbeat_server.dispose()).timeout(1000);
    }

    log('[heartbeat_end_ok]');
    process.exit(0);
}

function log(s)
{
    const ss = JSON.stringify(s).slice(1, -1).replaceAll('\\"', '"');
    if (ss[0] === '[') {
        console.log(`[${LOGS_ROOT_UID}][${now_human()}]${ss}`);
    }
    else {
        console.log(`[${LOGS_ROOT_UID}][${now_human()}] ${ss}`);
    }
}

function usage()
{
    process.stdout.write(`
usage: watchdog <cmd> [args...]

Runs <cmd> under supervision.  Watchdog starts a heartbeat server,
spawns the child process, and expects the child to periodically send
PING messages to the provided UNIX socket.

Environment variables passed to the child:

  WATCHDOG_SOCKET   Path to the UNIX socket that accepts heartbeat
                    messages.  The child must connect and send 'PING'
                    frames at regular intervals.

  WATCHDOG_INTERVAL Heartbeat interval in milliseconds.  The child must
                    send at least one PING within each interval.  If no
                    PING is received before the timeout expires, the
                    child is considered unresponsive.

Behavior:

  1) Watchdog creates a heartbeat server bound to WATCHDOG_SOCKET.
  2) Watchdog spawns <cmd> with WATCHDOG_SOCKET and WATCHDOG_INTERVAL
     injected into the child's environment.
  3) Watchdog waits for either:
        - a heartbeat timeout (no PING received in time), or
        - the child process exiting.
  4) If the heartbeat timeout expires, watchdog terminates the child
     process (SIGTERM → grace period → SIGKILL).
  5) Watchdog shuts down the heartbeat server and exits with a
     non-zero status on failure or with the child's exit code on
     normal termination.

Exit Codes:

------------------------+---------
child exit 0            | 0
child exit non-zero     | child exit code
heartbeat timeout       | 124
SIGINT                  | 130
SIGTERM                 | 143
watchdog internal error | 1
-----------------------------------
`.trim() + '\n');
}
