const assert = require('assert');
const ignore = require('./ignore');

describe('ignore', function () {
    it('returns undefined when called without arguments', function () {
        assert.strictEqual(ignore(), undefined);
    });

    it('returns undefined regardless of arguments', function () {
        assert.strictEqual(ignore(1), undefined);
        assert.strictEqual(ignore('a', 'b'), undefined);
        assert.strictEqual(ignore({a: 1}, [1, 2], null, undefined), undefined);
    });
});
