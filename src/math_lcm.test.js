const assert = require('assert');
const math_lcm = require('./math_lcm');

describe('math_lcm', function () {
    it('should handle basic input', function () {
        assert.strictEqual(math_lcm(4, 6), 12);
        assert.strictEqual(math_lcm(15, 25), 75);
        assert.strictEqual(math_lcm(0, 5), 0);
    });
    it('should be non-negative for negative input', function () {
        assert.strictEqual(math_lcm(4, -6), 12);
        assert.strictEqual(math_lcm(-4, 6), 12);
        assert.strictEqual(math_lcm(-4, -6), 12);
    });
});
