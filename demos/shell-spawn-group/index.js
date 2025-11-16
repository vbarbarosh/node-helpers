#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const pgid_exists = require('../../src/pgid_exists');
const pgid_kill_grace = require('../../src/pgid_kill_grace');
const shell_spawn = require('@vbarbarosh/node-helpers/src/shell_spawn');

cli(main);

async function main()
{
    const proc = shell_spawn(['./child.js'], {detached: true});
    const pgid = proc.pid; // group id == leader pid

    console.log('pgid_exists', pgid_exists(pgid));

    await pgid_kill_grace(pgid, {log: s => console.log(s)});

    console.log('pgid_exists', pgid_exists(pgid));
    console.log('🎉 Done');
}
