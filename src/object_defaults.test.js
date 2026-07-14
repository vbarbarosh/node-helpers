const assert = require('assert');
const object_defaults = require('./object_defaults');

describe('object_defaults', function () {
    it('fills missing keys from defaults', function () {
        const obj = {a: 1};
        assert.deepStrictEqual(object_defaults(obj, {a: 10, b: 20}), {a: 1, b: 20});
    });

    it('does not clobber existing keys', function () {
        const obj = {a: 1, b: 2};
        assert.deepStrictEqual(object_defaults(obj, {a: 10, b: 20}), {a: 1, b: 2});
    });

    it('keeps falsy existing values (0, "", false, null)', function () {
        const obj = {a: 0, b: '', c: false, d: null};
        const expected = {a: 0, b: '', c: false, d: null};
        assert.deepStrictEqual(object_defaults(obj, {a: 1, b: 'x', c: true, d: 'y'}), expected);
    });

    it('replaces keys explicitly set to undefined', function () {
        const obj = {a: undefined};
        assert.deepStrictEqual(object_defaults(obj, {a: 1}), {a: 1});
    });

    it('mutates and returns the same object', function () {
        const obj = {a: 1};
        const result = object_defaults(obj, {b: 2});
        assert.strictEqual(result, obj);
        assert.deepStrictEqual(obj, {a: 1, b: 2});
    });

    it('does not mutate the defaults object', function () {
        const defaults = {a: 1, b: 2};
        object_defaults({a: 10}, defaults);
        assert.deepStrictEqual(defaults, {a: 1, b: 2});
    });

    it('handles empty defaults', function () {
        assert.deepStrictEqual(object_defaults({a: 1}, {}), {a: 1});
    });

    it('handles empty target object', function () {
        assert.deepStrictEqual(object_defaults({}, {a: 1}), {a: 1});
    });
});
