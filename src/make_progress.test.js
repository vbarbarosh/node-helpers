const Promise = require('bluebird');
const assert = require('assert');
const make_progress = require('./make_progress');

describe('make_progress', function () {
    it('should start with unknown rate and eta', function () {
        const p = make_progress(100);
        assert.strictEqual(p.done, 0);
        assert.strictEqual(p.rate, null);
        assert.strictEqual(p.eta, null);
    });
    it('should never produce Infinity or NaN', function () {
        const p = make_progress(100);
        p.add(10);
        assert(p.rate === null || Number.isFinite(p.rate), `rate=${p.rate}`);
        assert(p.eta === null || Number.isFinite(p.eta), `eta=${p.eta}`);
    });
    it('should compute rate and eta from the history window', async function () {
        const p = make_progress(100);
        p.add(10);
        await Promise.delay(20);
        p.add(10);
        assert.strictEqual(p.done, 20);
        assert(Number.isFinite(p.rate) && p.rate > 0, `rate=${p.rate}`);
        assert(Number.isFinite(p.eta) && p.eta > 0, `eta=${p.eta}`);
        assert.strictEqual(p.percents, 0.2);
    });
    it('should report unknown rate and eta after a single sample', async function () {
        const p = make_progress(100);
        p.add(10);
        await Promise.delay(20);
        p.refresh();
        assert.strictEqual(p.rate, null);
        assert.strictEqual(p.eta, null);
    });
    it('should measure the rate between samples, not counting the first delta', async function () {
        // 10 units 300ms apart is ~33/s; the old code counted the first
        // delta too and reported ~66/s (and half the real eta)
        const p = make_progress(100);
        p.add(10);
        await Promise.delay(300);
        p.add(10);
        assert(p.rate >= 20 && p.rate <= 40, `rate=${p.rate}`);
        assert(p.eta >= 2 && p.eta <= 4, `eta=${p.eta}`);
    });
    it('should report unknown eta while the rate is zero', async function () {
        const p = make_progress(100);
        p.add(0);
        await Promise.delay(20);
        p.add(0);
        assert.strictEqual(p.rate, 0);
        assert.strictEqual(p.eta, null);
    });
});
