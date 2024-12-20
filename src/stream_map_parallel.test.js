const Promise = require('bluebird');
const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_map_parallel = require('./stream_map_parallel');

describe('stream_map_parallel', function () {
    it('basic', async function () {
        const r = Array(100).fill().map((v,i) => i);
        const out = [];
        await stream.promises.pipeline(
            stream.Readable.from(r),
            stream_map_parallel({
                concurrency: 5,
                handler: async function (num) {
                    await Promise.delay(0);
                    return num;
                },
            }),
            stream_each(function (item) {
                out.push(item);
            }),
        );
        assert.deepStrictEqual(out, r);
    });
});
