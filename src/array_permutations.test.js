const array_permutations = require('./array_permutations');
const assert = require('assert');

describe('array_permutations', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_permutations([]), [[]]);
        assert.deepStrictEqual(array_permutations([1,2]), [[1,2],[2,1]]);
        assert.deepStrictEqual(array_permutations([1,2,3]), [[1,2,3],[2,1,3],[3,1,2],[1,3,2],[2,3,1],[3,2,1]]);
    });
});
