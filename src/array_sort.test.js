const array_sort = require('./array_sort');
const assert = require('assert');

describe('array_sort', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sort([5,4,3,2,1]), [1,2,3,4,5]);
        assert.deepStrictEqual(array_sort([5,4,3,2,1], v => v), [1,2,3,4,5]);
        assert.deepStrictEqual(array_sort([{id:5},{id:4},{id:3},{id:2},{id:1}], v => v.id), [{id:1},{id:2},{id:3},{id:4},{id:5}]);
    });
});
