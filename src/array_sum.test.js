const array_sum = require('./array_sum');
const assert = require('assert');

describe('array_sum', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sum([1,2,3,4,5]), 15);
    });
    it('should cast strings to numbers', function () {
        assert.deepStrictEqual(array_sum(['1','2','3','4','5']), 15);
    });
});
