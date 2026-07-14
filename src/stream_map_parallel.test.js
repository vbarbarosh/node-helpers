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
    it('should drop items mapped to null', async function () {
        const actual = [];
        await stream.promises.pipeline(
            stream.Readable.from([1, 2, 3, 4, 5]),
            stream_map_parallel({
                concurrency: 2,
                handler: async function (num) {
                    await Promise.delay(0);
                    return (num === 2) ? null : num;
                },
            }),
            stream_each(function (item) {
                actual.push(item);
            }),
        );
        assert.deepStrictEqual(actual, [1, 3, 4, 5]);
    });
    it('should reject when handler fails', async function () {
        await assert.rejects(stream.promises.pipeline(
            stream.Readable.from([1, 2, 3]),
            stream_map_parallel({
                concurrency: 2,
                handler: async function (num) {
                    throw new Error('boom');
                },
            }),
            stream_each(function () {}),
        ), /boom/);
    });
});
