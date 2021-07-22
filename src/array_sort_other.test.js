import array_sort_other from './array_sort_other';
import assert from 'assert';

describe('array_sort_other', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sort_other([1,2,3,4,5], [5]), [5,1,2,3,4]);
    });
});
