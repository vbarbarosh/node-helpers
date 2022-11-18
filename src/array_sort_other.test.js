const array_sort_other = require('./array_sort_other');
const assert = require('assert');

describe('array_sort_other', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sort_other([1,2,3,4,5], v => v, [5]), [5,1,2,3,4]);
        assert.deepStrictEqual(array_sort_other([{id:1},{id:2},{id:3},{id:4},{id:5}], v => v.id, [5]), [{id:5},{id:1},{id:2},{id:3},{id:4}]);
    });
});
