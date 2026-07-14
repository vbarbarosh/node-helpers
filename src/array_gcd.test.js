const array_gcd = require('./array_gcd');
const assert = require('assert');

describe('array_gcd', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_gcd([1,2,3,4,5]), 1);
        assert.deepStrictEqual(array_gcd([4,8,16]), 4);
        assert.deepStrictEqual(array_gcd([300,100,200,300]), 100);
    });
    it('should handle single-element and empty arrays', function () {
        assert.deepStrictEqual(array_gcd([5]), 5);
        assert.deepStrictEqual(array_gcd([]), 0);
    });
    it('should be non-negative for negative input', function () {
        assert.deepStrictEqual(array_gcd([4,-6]), 2);
        assert.deepStrictEqual(array_gcd([-4,-6]), 2);
    });
});
