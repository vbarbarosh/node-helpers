const assert = require('assert');
const throttle = require('./throttle');
const wait_while = require('./wait_while');

describe('throttle', function () {
    it('should collapse a burst into one trailing call with the last value', async function () {
        const calls = [];
        const run = throttle(10, v => calls.push(v));
        run(1);
        run(2);
        run(3);
        assert.deepStrictEqual(calls, []);
        await wait_while(() => calls.length === 0);
        assert.deepStrictEqual(calls, [3]);
    });
    it('should fire again for a burst after the window', async function () {
        const calls = [];
        const run = throttle(10, v => calls.push(v));
        run(1);
        await wait_while(() => calls.length === 0);
        run(2);
        await wait_while(() => calls.length === 1);
        assert.deepStrictEqual(calls, [1, 2]);
    });
    it('fire() should flush immediately and be a no-op when idle', async function () {
        const calls = [];
        const run = throttle(60000, v => calls.push(v));
        run('x');
        run.fire();
        assert.deepStrictEqual(calls, ['x']);
        run.fire();
        assert.deepStrictEqual(calls, ['x']);
    });
});
