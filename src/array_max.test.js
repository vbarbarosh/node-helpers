const array_max = require('./array_max');
const assert = require('assert');

describe('array_max', function () {
    it('should accept empty array', function () {
        assert.deepStrictEqual(array_max([]), null);
    });
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_max([1, 1, 2, 2, 3, 3, 1]), 3);
        assert.deepStrictEqual(array_max([{x:1},{x:2}], v => v.x), {x: 2});
    });
});
