#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const fs_exists = require('../src/fs_exists');
const fs_list = require('@vbarbarosh/node-helpers/src/fs_list');
const fs_list_deep = require('../src/fs_list_deep');
const fs_path_relative = require('@vbarbarosh/node-helpers/src/fs_path_relative');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const fs_write_json = require('@vbarbarosh/node-helpers/src/fs_write_json');
const perf_end_human = require('@vbarbarosh/node-helpers/src/perf_end_human');
const perf_start = require('@vbarbarosh/node-helpers/src/perf_start');

cli(main);

async function main()
{
    const time0 = perf_start();

    const out = {
        demos: [],
        src: [],
    };

    for (const file of await fs_list(`${__dirname}/../src`)) {
        if (file.isDirectory()) {
            continue;
        }
        if (file.basename.endsWith('.test.js') || !file.basename.endsWith('.js')) {
            continue;
        }
        const md_file = file.pathname.endsWith('.js') ? file.pathname.replace(/\.js$/, '.md') : null;
        out.src.push({
            id: file.basename.replace(/\..*/, ''),
            name: file.basename.replace(/\..*/, ''),
            file: fs_path_relative(`${__dirname}/..`, file.pathname),
            require: imp(file),
            source_code: await fs_read_utf8(file.pathname),
            markdown: md_file && await fs_exists(md_file) ? await fs_read_utf8(md_file) : null,
        });
    }
    for (const file of await fs_list_deep(`${__dirname}/../demos`)) {
        if (file.isDirectory()) {
            continue;
        }
        out.demos.push({
            id: fs_path_relative(`${__dirname}/..`, file.pathname).replaceAll('/', '-').replaceAll('.', '-'),
            file: fs_path_relative(`${__dirname}/..`, file.pathname),
            contents: await fs_read_utf8(file.pathname),
        });
    }
    await fs_write_json(`${__dirname}/../docs/data.json`, out);

    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}

function imp(file)
{
    const name = file.basename.replace(/\..*/, '');
    return `const ${name} = require('@vbarbarosh/node-helpers/src/${name}');`;
}
