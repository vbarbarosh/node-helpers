const assert = require('assert');
const object_schema = require('./object_schema');

describe('object_schema', function () {
    it('basic 1', function () {
        const actual = object_schema({aaa: 1, bbb: 2});
        const expected = {type: 'object', props: {aaa: {type: 'number'}, bbb: {type: 'number'}}};
        assert.deepStrictEqual(actual, expected);
    });
    it('basic 2', function () {
        const actual = object_schema({aaa: 1, bbb: [1, 2, 3, 4, 'str']});
        const expected = {type: 'object', props: {aaa: {type: 'number'}, bbb: {type: 'array', types: [{type: 'number'}, {type: 'string'}]}}};
        assert.deepStrictEqual(actual, expected);
    });
});
