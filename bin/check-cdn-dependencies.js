#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs = require('fs');
const path = require('path');
const lock = require('../package-lock.json');
const pkg = require('../package.json');

cli(main);

function main()
{
    const root = path.resolve(__dirname, '..');
    const expected = pkg.dependencies.axios;
    const locked = lock.packages['node_modules/axios']?.version;
    const files = [
        'dist.templ/index.html',
        'dist/index.html',
        'docs/index.html',
    ];

    if (!/^\d+\.\d+\.\d+$/.test(expected)) {
        throw new Error(`package.json dependencies.axios must be an exact version; received ${JSON.stringify(expected)}`);
    }
    if (locked !== expected) {
        throw new Error(`package-lock.json resolves axios ${JSON.stringify(locked)}; expected ${expected}`);
    }

    for (const file of files) {
        const html = fs.readFileSync(path.join(root, file), 'utf8');
        const versions = [...html.matchAll(/https:\/\/unpkg\.com\/axios@([^/]+)\/dist\/axios(?:\.min)?\.js/g)].map(match => match[1]);
        if (versions.length !== 1) {
            throw new Error(`${file} must contain exactly one versioned unpkg Axios script; found ${versions.length}`);
        }
        if (versions[0] !== expected) {
            throw new Error(`${file} pins Axios ${versions[0]}; expected ${expected}`);
        }
    }

    console.log(`Axios CDN pins match package.json and package-lock.json: ${expected}`);
}
