const array_min = require('./array_min');
const assert = require('assert');

describe('array_min', function () {
    it('should accept empty array', function () {
        assert.deepStrictEqual(array_min([]), null);
    });
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_min([1, 1, 2, 2, 3, 3, 1]), 1);
        assert.deepStrictEqual(array_min([{x:2},{x:1}], v => v.x), {x: 1});
    });
    it('should handle strings', function () {
        const items = [
            {id: 1, time: '2025-08-08T05:03:13+00:00'},
            {id: 2, time: '2025-08-07T05:03:13+00:00'},
            {id: 3, time: '2025-08-06T05:03:13+00:00'},
        ];
        assert.deepStrictEqual(array_min(items, v => v.time), items[2]);
    });
});
