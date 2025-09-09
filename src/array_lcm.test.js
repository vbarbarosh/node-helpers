const array_lcm = require('./array_lcm');
const assert = require('assert');

describe('array_lcm', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_lcm([1,2,3,4,5]), 60);
        assert.deepStrictEqual(array_lcm([15,25]), 75);
        assert.deepStrictEqual(array_lcm([4,6,8]), 24);
        assert.deepStrictEqual(array_lcm([4,8,16]), 16);
        assert.deepStrictEqual(array_lcm([300,100,200,300]), 600);
    });
});
