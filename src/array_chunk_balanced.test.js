const array_chunk_balanced = require('./array_chunk_balanced');
const assert = require('assert');

describe('array_chunk_balanced', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_chunk_balanced([1]), [[1]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2]), [[1,2]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3]), [[1,2,3]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5], 3, 2), [[1,2,3],[4,5]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5,6], 3, 2), [[1,2],[3,4],[5,6]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5,6,7], 3, 2), [[1,2,3],[4,5],[6,7]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5], 3, 3), [[1,2,3,4,5]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5,6], 3, 3), [[1,2,3],[4,5,6]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5,6,7], 3, 3), [[1,2,3,4],[5,6,7]]);
        assert.deepStrictEqual(array_chunk_balanced([1,2,3,4,5,6,7,8], 3, 3), [[1,2,3,4],[5,6,7,8]]);
    });
    it('edge: If an array is empty → returns []', function () {
        assert.deepStrictEqual(array_chunk_balanced([]), []);
    });
    it('edge: If there are too few items to satisfy `min_items_per_chunk`, even for 1 chunk, everything goes into a single chunk', function () {
        assert.deepStrictEqual(array_chunk_balanced([1,2,3], 5, 5), [[1,2,3]]);
    });
    it('should never produce more chunks than max_threads', function () {
        // 12 jobs, max 5 threads, min 2 jobs per thread
        // Correct result MUST have exactly 5 chunks
        assert.deepStrictEqual(
            array_chunk_balanced([1,2,3,4,5,6,7,8,9,10,11,12], 5, 2),
            [
                [1,2,3],
                [4,5,6],
                [7,8],
                [9,10],
                [11,12]
            ]
        );
    });
});
