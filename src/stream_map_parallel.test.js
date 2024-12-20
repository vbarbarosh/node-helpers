const Promise = require('bluebird');
const assert = require('assert');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_map_parallel = require('./stream_map_parallel');

describe('stream_map_parallel', function () {
    it('basic', async function () {
        const actual = [];
        const expected = Array(100).fill().map((v,i) => i);
        await stream.promises.pipeline(
            stream.Readable.from(expected),
            stream_map_parallel({
                concurrency: 5,
                handler: async function (num) {
                    await Promise.delay(0);
                    return num;
                },
            }),
            stream_each(function (item) {
                actual.push(item);
            }),
        );
        assert.deepStrictEqual(actual, expected);
    });
});
