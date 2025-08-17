const Promise = require('bluebird');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const random_int = require('@vbarbarosh/node-helpers/src/random_int');
const stream = require('stream');
const stream_chunk = require('@vbarbarosh/node-helpers/src/stream_chunk');
const stream_each = require('@vbarbarosh/node-helpers/src/stream_each');
const stream_map_parallel = require('@vbarbarosh/node-helpers/src/stream_map_parallel');
const stream_progress = require('@vbarbarosh/node-helpers/src/stream_progress');

cli(main);

async function main()
{
    const input = Array(100).fill().map((v,i) => i);
    await stream.promises.pipeline(
        stream.Readable.from(input),
        stream_map_parallel({
            concurrency: 10,
            handler: async function (item) {
                await Promise.delay(random_int(100, 5000));
                return item;
            },
        }),
        stream_progress({
            objectMode: true,
            total: input.length,
            user_friendly_status,
        }),
        stream_chunk(10),
        stream_each(function (items) {
            console.log(items);
        }),
    );
    console.log('🎉 Done');
}

function user_friendly_status(s)
{
    console.log(s);
}
