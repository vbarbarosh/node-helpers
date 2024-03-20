const assert = require('assert');
const object_schema = require('./object_schema');

describe('object_schema', function () {
    it('basic 1', function () {
        const actual = object_schema({aaa: 1, bbb: 2});
        const expected = {aaa: 'number', bbb: 'number'};
        assert.deepStrictEqual(actual, expected);
    });
    it('basic 2', function () {
        const actual = object_schema({aaa: 1, bbb: [1, 2, 3, 4, 'str']});
        const expected = {aaa: 'number', bbb: ['number', 'string']};
        assert.deepStrictEqual(actual, expected);
    });
});
