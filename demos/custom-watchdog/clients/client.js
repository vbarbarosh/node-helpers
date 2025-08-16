const Promise = require('bluebird');
const cli = require('../../../src/cli');
const ping_socket = require('../../../src/ping_socket');

cli(main);

async function main()
{
    for (let i = 0; i < 100; ++i) {
        console.log('[client]', i);
        await ping_socket(process.env.WATCHDOG_SOCKET);
        await Promise.delay(1000);
    }
}
