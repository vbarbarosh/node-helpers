#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_rmf = require('@vbarbarosh/node-helpers/src/fs_rmf');

cli(main);

async function main()
{
    await fs_rmf('a');
}
