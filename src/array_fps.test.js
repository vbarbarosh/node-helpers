const array_fps = require('./array_fps');
const assert = require('assert');

describe('array_fps', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_fps(1, 1), [0]);
        assert.deepStrictEqual(array_fps(1, 2), [0, 0.99999]);
        assert.deepStrictEqual(array_fps(1, 3), [0, 0.49999, 0.99999]);
        assert.deepStrictEqual(array_fps(1, 4), [0, 0.33333, 0.66666, 0.99999]);
    });
});
