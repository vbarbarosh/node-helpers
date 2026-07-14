const assert = require('assert');
const random_int = require('./random_int');

describe('random_int', function () {
    it('returns integers within [min, max], max inclusive', function () {
        for (let i = 0; i < 200; i++) {
            const value = random_int(1, 6);
            assert.strictEqual(Number.isInteger(value), true);
            assert.strictEqual(value >= 1, true);
            assert.strictEqual(value <= 6, true);
        }
    });

    it('handles negative ranges', function () {
        for (let i = 0; i < 200; i++) {
            const value = random_int(-10, -5);
            assert.strictEqual(Number.isInteger(value), true);
            assert.strictEqual(value >= -10, true);
            assert.strictEqual(value <= -5, true);
        }
    });

    it('handles ranges spanning zero', function () {
        for (let i = 0; i < 200; i++) {
            const value = random_int(-3, 3);
            assert.strictEqual(Number.isInteger(value), true);
            assert.strictEqual(value >= -3, true);
            assert.strictEqual(value <= 3, true);
        }
    });

    it('returns min when min === max', function () {
        for (let i = 0; i < 50; i++) {
            assert.strictEqual(random_int(7, 7), 7);
        }
    });
});
