const assert = require('assert');
const stream = require('stream');
const stream_progress = require('./stream_progress');

describe('stream_progress', function () {
    it('should pass bytes through unchanged and report 100% at the end', async function () {
        const statuses = [];
        const input = [Buffer.from('aaa'), Buffer.from('bbb')];
        const progress = stream_progress({interval: 60000, total: 6, user_friendly_status: s => statuses.push(s)});
        const out = Buffer.concat(await stream.Readable.from(input).pipe(progress).toArray());
        assert.strictEqual(out.toString('utf8'), 'aaabbb');
        assert.ok(statuses.length >= 1, 'no status messages emitted');
        assert.match(statuses[statuses.length - 1], /100%/);
    });
    it('should count items in objectMode', async function () {
        const statuses = [];
        const progress = stream_progress({objectMode: true, interval: 60000, total: 3, user_friendly_status: s => statuses.push(s)});
        const out = await stream.Readable.from([{a: 1}, {b: 2}, {c: 3}]).pipe(progress).toArray();
        assert.deepStrictEqual(out, [{a: 1}, {b: 2}, {c: 3}]);
        assert.match(statuses[statuses.length - 1], /100%/);
    });
    it('should emit the first message before any data arrives', async function () {
        const statuses = [];
        const progress = stream_progress({interval: 60000, total: 6, user_friendly_status: s => statuses.push(s)});
        await new Promise(resolve => setTimeout(resolve, 10));
        assert.ok(statuses.length >= 1, 'no early status message');
        progress.destroy();
    });
    it('should emit an error when destroyed with one', async function () {
        const error = new Error('boom');
        const events = [];
        const progress = stream_progress({interval: 60000, user_friendly_status: function () {}});
        progress.on('error', v => events.push(v));
        const closed = new Promise(resolve => progress.on('close', resolve));
        progress.destroy(error);
        await closed;
        assert.deepStrictEqual(events, [error]);
    });
    it('should reject a pipeline when destroyed with an error', async function () {
        const error = new Error('boom');
        const input = new stream.PassThrough();
        const progress = stream_progress({interval: 60000, user_friendly_status: function () {}});
        const output = new stream.PassThrough();
        const promise = stream.promises.pipeline(input, progress, output);
        progress.destroy(error);
        await assert.rejects(promise, error);
    });
    it('should preserve a destroy error when the final status callback throws', async function () {
        const error = new Error('boom');
        const progress = stream_progress({
            interval: 60000,
            user_friendly_status: function () {
                throw new Error('status failed');
            },
        });
        const promise = stream.promises.finished(progress);
        progress.destroy(error);
        await assert.rejects(promise, error);
    });
});
