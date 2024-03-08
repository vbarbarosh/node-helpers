const assert = require('assert');
const object_walk_preorder = require('./object_walk_preorder');

describe('object_walk_preorder', function () {
    it('basic 1', function () {
        const actual = [];
        const expected = ['aaa', 'bbb', 'ccc'];
        object_walk_preorder({aaa: 1, bbb: 2, ccc: 3}, (v,p) => actual.push(p.join('/')));
        assert.deepStrictEqual(actual, expected);
    });
    it('basic 2', function () {
        const actual = [];
        const expected = ['aaa', 'aaa/foo', 'aaa/foo/bar', 'aaa/foo/bar/baz', 'bbb', 'ccc'];
        object_walk_preorder({aaa: {foo: {bar: {baz: 1}}}, bbb: 2, ccc: 3}, (v,p) => actual.push(p.join('/')));
        assert.deepStrictEqual(actual, expected);
    });
});
