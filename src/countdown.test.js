const Promise = require('bluebird');
const assert = require('assert');
const countdown = require('./countdown');

describe('countdown', function () {
    it('should resolve with the value', async function () {
        assert.strictEqual(await countdown({value: Promise.delay(10).then(() => 'x')}), 'x');
    });
    it('should support fn instead of value', async function () {
        assert.strictEqual(await countdown({fn: () => Promise.delay(10).then(() => 'x')}), 'x');
    });
    it('should call tick every tick_ms', async function () {
        let calls = 0;
        await countdown({value: Promise.delay(50), tick_ms: 10, tick: () => calls++});
        assert(calls >= 2, `calls=${calls}`);
    });
    it('should reject with Timeout', async function () {
        await assert.rejects(countdown({value: new Promise(() => {}), timeout: 30, tick_ms: 10}), /^Error: Timeout$/);
    });
    it('should reject when tick throws and stop the timers', async function () {
        let calls = 0;
        await assert.rejects(countdown({
            value: new Promise(() => {}),
            tick_ms: 10,
            tick: function () {
                ++calls;
                throw new Error('boom');
            },
        }), /boom/);
        // The interval must be cleared: with the leak, tick would keep
        // firing and each throw would be an uncaughtException.
        await Promise.delay(50);
        assert.strictEqual(calls, 1);
    });
});
