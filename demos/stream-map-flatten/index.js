#!/usr/bin/env node

const cli = require('../../src/cli');
const stream = require('stream');
const stream_each = require('../../src/stream_each');
const stream_map_flatten = require('../../src/stream_map_flatten');

cli(main);

async function main()
{
    await stream.promises.pipeline(
        stream.Readable.from([1, 2, 3, 4, 5]),
        // Fancy stream_filter
        stream_map_flatten(function (item) {
            if (item % 2 === 0) {
                return [item];
            }
            return [];
        }),
        stream_each(function (items) {
            console.log(items);
        }),
    );
    console.log('🎉 Done');
}
