#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const str_parse_kv = require('@vbarbarosh/node-helpers/src/str_parse_kv');

cli(main);

async function main()
{
    const utf8 = await fs_read_utf8('/proc/self/status');
    const kv = Object.fromEntries(utf8.split('\n').map(str_parse_kv));
    console.log(kv);
}
