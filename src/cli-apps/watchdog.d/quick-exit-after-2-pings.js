#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../cli');
const ping_socket = require('../../ping_socket');

cli(main);

async function main()
{
    for (let iter = 1, last = 2; iter <= last; ++iter) {
        await ping_socket(process.env.WATCHDOG_SOCKET);
        await Promise.delay(10);
    }
}
