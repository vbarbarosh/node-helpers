const cli = require('@vbarbarosh/node-helpers/src/cli');
const stream = require('stream');
const stream_chunk = require('@vbarbarosh/node-helpers/src/stream_chunk');
const stream_each = require('@vbarbarosh/node-helpers/src/stream_each');
const stream_progress = require('@vbarbarosh/node-helpers/src/stream_progress');

cli(main);

async function main()
{
    const items = [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9},
        {id: 10},
    ];
    await stream.promises.pipeline(
        stream.Readable.from(items),
        stream_progress({
            objectMode: true,
            total: items.length,
            user_friendly_status: v => console.log(`[status] ${v}`),
        }),
        stream_chunk(3),
        stream_each(function (item) {
            console.log('[stream_each]', item);
        }),
    );
    console.log('🎉 Done');
}
