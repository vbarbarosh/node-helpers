const assert = require('assert');
const math_gcd = require('./math_gcd');

describe('math_gcd', function () {
    it('should handle basic input', function () {
        assert.strictEqual(math_gcd(12, 18), 6);
        assert.strictEqual(math_gcd(5, 7), 1);
        assert.strictEqual(math_gcd(0, 5), 5);
        assert.strictEqual(math_gcd(5, 0), 5);
    });
    it('should be non-negative for negative input', function () {
        assert.strictEqual(math_gcd(4, -6), 2);
        assert.strictEqual(math_gcd(-4, 6), 2);
        assert.strictEqual(math_gcd(-4, -6), 2);
    });
});
