import array_index from './array_index';
import assert from 'assert';

describe('array_index', function () {
    it('should accept empty array', function () {
        assert.deepStrictEqual(array_index([]), {});
    });
    it('should handle basic input', function () {
        const a = {uid: 'a'};
        const b = {uid: 'b'};
        const c = {uid: 'c'};
        assert.deepStrictEqual(array_index([a, b, c], v => v.uid), {a, b, c});
    });
});
