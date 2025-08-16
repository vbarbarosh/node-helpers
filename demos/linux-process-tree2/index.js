#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const fs_read_utf8 = require('../../src/fs_read_utf8');
const fs_readdir = require('../../src/fs_readdir');
const str_parse_kv = require('../../src/str_parse_kv');
const tree_from_array = require('@vbarbarosh/tree/src/tree_from_array');
const tree_print = require('@vbarbarosh/tree/src/tree_print');

cli(main);

async function main()
{
    const nodes = [];
    await Promise.map(fs_readdir('/proc'), async function (pid) {
        if (!pid.match(/^[0-9]+$/)) {
            return;
        }
        // https://docs.kernel.org/filesystems/proc.html#id10
        // https://docs.kernel.org/filesystems/proc.html#id12
        const utf8 = await fs_read_utf8(`/proc/${pid}/status`);
        const status = Object.fromEntries(utf8.split('\n').map(str_parse_kv));
        nodes.push({id: status.Pid, parent_id: status.PPid, title: `[${status.Pid}, ${status.State}] ${status.Name}`});
    });
    console.log(tree_print(tree_from_array(nodes)));
}
