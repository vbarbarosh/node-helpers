#!/usr/bin/env node

const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_list_deep = require('../src/fs_list_deep');
const fs_path_relative = require('@vbarbarosh/node-helpers/src/fs_path_relative');
const fs_path_resolve = require('../src/fs_path_resolve');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const fs_write = require('../src/fs_write');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');
const pkg = require('../package.json');

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

        // docs/js/browser.js is the build's copy of dist/browser.js: its version is already the package's
        if (relative(file.pathname) === 'docs/js/browser.js') {
            continue;
        }

        const body = await fs_read_utf8(file.pathname);

        // <script src="https://unpkg.com/@vbarbarosh/node-helpers@3.66.1/dist/browser.js?var=h"></script>
        const body2 = body.replace(/(@vbarbarosh\/node-helpers@).+?\//g, function (match, m1) {
            const out = `${m1}${pkg.version}/`;
            if (match !== out) {
                console.log(`🔁 [${relative(file.pathname)}] ${match} → ${out}`);
            }
            return out;
        });

        // "@vbarbarosh/node-helpers": "^3.67.0"
        const body3 = body2.replace(/("@vbarbarosh\/node-helpers":\s*)"(\D?).+?"/g, function (match, m1, m2) {
            const out = `${m1}"${m2}${pkg.version}"`;
            if (match !== out) {
                console.log(`🔁 [${relative(file.pathname)}] ${match} → ${out}`);
            }
            return out;
        });

        // <script src="js/browser.js?v=3.79.0&var=h"></script>: the page's own scripts, fetched anew after each release
        const body4 = body3.replace(/(src="js\/[^"?]+\?v=)[^&"]+/g, function (match, m1) {
            const out = `${m1}${pkg.version}`;
            if (match !== out) {
                console.log(`🔁 [${relative(file.pathname)}] ${match} → ${out}`);
            }
            return out;
        });

        if (body !== body4) {
            console.log(`💾 [${relative(file.pathname)}] Saving...`);
            await fs_write(file.pathname, body4);
        }
    }

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}

function relative(path)
{
    return fs_path_relative(fs_path_resolve(__dirname, '..'), path);
}
