#!/usr/bin/env node

const cli = require('../../src/cli');
const shell = require('../../src/shell');

cli(main);

async function main()
{
    console.log('node version:', await shell(['node', '--version']));
    console.log('curl', await shell(['curl', '-sf', '-I', 'https://example.com']));
    console.log('tree', await shell(['tree']));
    console.log('false', await shell(['false']));
}
