#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('../../src/cli');
const fs_read_utf8 = require('../../src/fs_read_utf8');
const shell = require('../../src/shell');
const tree_from_array = require('@vbarbarosh/tree/src/tree_from_array');
const tree_print = require('@vbarbarosh/tree/src/tree_print');

cli(main);

async function main()
{
    const pstree = await shell(['ps', '-eo', 'pid,ppid']);
    const nodes = pstree.split('\n').slice(1, -1).map(function (line) {
        const [id, parent_id] = line.trim().split(/\s+/).map(v => +v);
        return {id, parent_id};
    });
    await Promise.map(nodes, async function (node) {
        try {
            const comm = await fs_read_utf8(`/proc/${node.id}/comm`)
            node.title = `[${node.id}] ${comm.trim()}`;
        }
        catch {
            node.title = `[${node.id}] ?`;
        }
    });
    console.log(tree_print(tree_from_array(nodes)));
}
