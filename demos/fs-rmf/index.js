#!/usr/bin/env node

const cli = require('../../src/cli');
const fs_rmf = require('../../src/fs_rmf');

cli(main);

async function main()
{
    await fs_rmf('a');
}
