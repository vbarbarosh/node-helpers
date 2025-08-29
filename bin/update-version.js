#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_exists = require('../src/fs_exists');
const fs_list = require('@vbarbarosh/node-helpers/src/fs_list');
const fs_list_deep = require('../src/fs_list_deep');
const fs_path_relative = require('@vbarbarosh/node-helpers/src/fs_path_relative');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const fs_write_json = require('@vbarbarosh/node-helpers/src/fs_write_json');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');
const fs_path_resolve = require('../src/fs_path_resolve');
const pkg = require('../package.json');
const fs_write = require('../src/fs_write');

cli(main);

async function main()
{
    const time0 = perf_start();

    const files = [
        `${__dirname}/../README.md`,
        `${__dirname}/../docs`,
    ];

    for (const file of await Promise.map(files, fs_list_deep).then(v => v.flat())) {
        if (file.isDirectory() || !file.basename.match(/\.(md|js|html)$/)) {
            continue;
        }
        const body = await fs_read_utf8(file.pathname);
        // <script src="https://unpkg.com/@vbarbarosh/node-helpers@3.66.1/dist/browser.js?var=h"></script>
        // "@vbarbarosh/node-helpers": "^3.67.0"
        const body2 = body.replace(/(@vbarbarosh\/node-helpers@).+?\//g, function (match, m1) {
            const path = fs_path_relative(fs_path_resolve(__dirname, '..'), file.pathname);
            const out = `${m1}${pkg.version}/`;
            if (match !== out) {
                console.log(`[${path}] ${match} → ${out}`);
            }
            return out;
        });
        if (body !== body2) {
            await fs_write(file.pathname, body2);
        }
    }

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
