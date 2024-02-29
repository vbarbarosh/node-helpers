const assert = require('assert');
const ignore = require('./ignore');
const stream = require('stream');
const stream_multiplex = require('./stream_multiplex');

describe('stream_multiplex', function () {
    it('basic', async function () {
        const input = [1, 2, 3, 'str1'];
        const rs = stream.Readable.from(input);
        const ws1 = stream_debug();
        const ws2 = stream_debug();
        await stream.promises.pipeline(rs, stream_multiplex(ws1, ws2));
        assert.deepStrictEqual(ws1.items, input);
        assert.deepStrictEqual(ws2.items, input);
        assert.deepStrictEqual(ws1.events.map(v => v.name), ['finish', 'close']);
        assert.deepStrictEqual(ws2.events.map(v => v.name), ['finish', 'close']);
    });
    it('should throw after first error', async function () {
        const input = [1, 2, 3, 'str1'];
        const fail_at = 2;
        const rs = stream.Readable.from(input);
        const ws1 = stream_debug();
        const ws2 = stream_debug();
        const p = stream.promises.pipeline(rs, stream_multiplex(ws1, ws2, stream_fail_at(fail_at)));
        await assert.rejects(p, new Error(`Failed at ${fail_at}`));
        assert.deepStrictEqual(ws1.items, input.slice(0, fail_at));
        assert.deepStrictEqual(ws2.items, input.slice(0, fail_at));
        assert.deepStrictEqual(ws1.events.map(v => v.name), ['error', 'close']);
        assert.deepStrictEqual(ws2.events.map(v => v.name), ['error', 'close']);
    });
});

function stream_debug()
{
    const out = new stream.Writable({
        objectMode: true,
        write: function (item, enc, next) {
            out.items.push(item);
            next();
        },
    });
    out.items = [];
    out.events = [];
    out.once('close', (...args) => out.events.push({name: 'close', args})); // result of `destroy`
    out.once('drain', (...args) => out.events.push({name: 'drain', args}));
    out.once('error', (...args) => out.events.push({name: 'error', args}));
    out.once('finish', (...args) => out.events.push({name: 'finish', args})); // result of `end`
    out.once('pipe', (...args) => out.events.push({name: 'pipe', args}));
    out.once('unpipe', (...args) => out.events.push({name: 'unpipe', args}));
    return out;
}

function stream_fail_at(at)
{
    let counter = 0;
    return new stream.Writable({
        objectMode: true,
        write: function (item, enc, next) {
            if (++counter >= at) {
                next(new Error(`Failed at ${at}`));
            }
            else {
                next();
            }
        },
    });
}
