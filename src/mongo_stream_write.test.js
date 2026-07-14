const assert = require('assert');
const mongo_stream_write = require('./mongo_stream_write');
const stream = require('stream');

describe('mongo_stream_write', function () {
    it('should pass operations to collection.bulkWrite', async function () {
        const calls = [];
        const collection = {bulkWrite: async operations => calls.push(operations)};
        await stream.promises.pipeline(
            stream.Readable.from([[{a: 1}], [{b: 2}]], {objectMode: true}),
            mongo_stream_write({collection}),
        );
        assert.deepStrictEqual(calls, [[{a: 1}], [{b: 2}]]);
    });
    it('should report an error from the last batch', async function () {
        // The rejection must land while final() is already waiting for
        // in-flight operations — a regression guard against checking
        // `errors` before that wait.
        const collection = {bulkWrite: () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('boom')), 20))};
        await assert.rejects(stream.promises.pipeline(
            stream.Readable.from([[{a: 1}]], {objectMode: true}),
            mongo_stream_write({collection}),
        ), /boom/);
    });
    it('should not hang when bulkWrite throws synchronously', async function () {
        const collection = {bulkWrite: () => { throw new Error('sync boom'); }};
        await assert.rejects(stream.promises.pipeline(
            stream.Readable.from([[{a: 1}]], {objectMode: true}),
            mongo_stream_write({collection}),
        ), /sync boom/);
    });
    it('should reject when input is not an array', async function () {
        const collection = {bulkWrite: async () => {}};
        await assert.rejects(stream.promises.pipeline(
            stream.Readable.from([{a: 1}], {objectMode: true}),
            mongo_stream_write({collection}),
        ), /An array of objects is expected/);
    });
});
