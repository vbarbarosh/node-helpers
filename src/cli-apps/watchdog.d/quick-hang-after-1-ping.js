#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../cli');
const ping_socket = require('../../ping_socket');

cli(main);

async function main()
{
    await ping_socket(process.env.WATCHDOG_SOCKET);
    while (true) {
        await Promise.delay(1000);
    }
}
