import array_sum from './array_sum';
import assert from 'assert';

describe('array_sum', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sum([1,2,3,4,5]), 15);
    });
    it('should cast strings to numbers', function () {
        assert.deepStrictEqual(array_sum(['1','2','3','4','5']), 15);
    });
});
