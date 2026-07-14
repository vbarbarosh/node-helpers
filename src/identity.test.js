const assert = require('assert');
const identity = require('./identity');

describe('identity', function () {
    it('returns primitive values unchanged', function () {
        assert.strictEqual(identity(42), 42);
        assert.strictEqual(identity('hello'), 'hello');
        assert.strictEqual(identity(true), true);
        assert.strictEqual(identity(null), null);
        assert.strictEqual(identity(undefined), undefined);
        assert.strictEqual(identity(0), 0);
        assert.strictEqual(identity(''), '');
    });

    it('returns objects and arrays by reference', function () {
        const obj = {a: 1};
        const arr = [1, 2, 3];
        const fn = function () {};
        assert.strictEqual(identity(obj), obj);
        assert.strictEqual(identity(arr), arr);
        assert.strictEqual(identity(fn), fn);
    });

    it('ignores extra arguments', function () {
        assert.strictEqual(identity(1, 2, 3), 1);
    });

    it('returns undefined when called without arguments', function () {
        assert.strictEqual(identity(), undefined);
    });
});
