#!/usr/bin/env node

const cli = require('../../src/cli');
const http_get_buffer = require('../../src/http_get_buffer');
const perf_end_human = require('../../src/perf_end_human');
const perf_start = require('../../src/perf_start');
const stream = require('stream');
const stream_parse_csv = require('../../src/stream-parse-csv');

cli(main);

async function main()
{
    const time0 = perf_start();

    const s = await http_get_buffer('https://www.bnm.md/en/export-official-exchange-rates?date=31.12.2024');

    const rows = await stream.Readable.from(s).compose(stream_parse_csv({delimiter: ';', relax_column_count: true})).toArray();
    if (rows.length === 1) {
        throw new Error(rows[0][0]);
    }

    const out = {};
    rows.forEach(function (cols) {
        switch (cols.length) {
        case 1:
            break;
        case 2:
            out[cols[0]] = cols[1];
            break;
        case 5:
            switch (cols[2]) {
            case 'USD':
            case 'EUR':
                out[cols[2].toLowerCase()] = +cols[4].replace(',', '.');
                break;
            }
            break;
        default:
            throw new Error(`Unrecognized number of columns: ${cols.length}`);
        }
    });
    out.date = rows[0][1].replace(/^(\d\d).(\d\d).(\d\d\d\d)$/, '$3/$2/$1');
    delete out.abbr;
    delete out[''];
    delete out['Data source:'];
    delete out['Date:'];
    delete out['Hour:'];

    console.log(out);
    console.log(`🎉 Done in ${perf_end_human(time0)}`);
}
