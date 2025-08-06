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
    it('should handle strings', function () {
        const items = [
            {id: 1, time: '2025-08-08T05:03:13+00:00'},
            {id: 2, time: '2025-08-07T05:03:13+00:00'},
            {id: 3, time: '2025-08-06T05:03:13+00:00'},
        ];
        assert.deepStrictEqual(array_max(items, v => v.time), items[0]);
    });
});
