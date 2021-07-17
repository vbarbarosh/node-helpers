import array_chunk from './array_chunk';
import assert from 'assert';

describe('array_chunk', function () {
    it('should accept no arguments', function () {
        assert.deepStrictEqual(array_chunk(), []);
    });
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_chunk([]), []);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5]), [[1],[2],[3],[4],[5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 1), [[1],[2],[3],[4],[5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 2), [[1,2],[3,4],[5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 3), [[1,2,3],[4,5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 4), [[1,2,3,4],[5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 5), [[1,2,3,4,5]]);
        assert.deepStrictEqual(array_chunk([1,2,3,4,5], 6), [[1,2,3,4,5]]);
    });
    it('should throw when limit is less than 1', function () {
        assert.throws(() => array_chunk([], 0));
        assert.throws(() => array_chunk([], -1));
        assert.throws(() => array_chunk([1], 0));
        assert.throws(() => array_chunk([1], -1));
    });
});
