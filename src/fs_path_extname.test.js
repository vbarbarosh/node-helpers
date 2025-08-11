const assert = require('assert');
const fs_path_extname = require('./fs_path_extname');

const tests = [
    ['.', ''],
    ['..', ''],
    ['.foo', ''],
    ['..foo', '.foo'],
    ['.foo.bar', '.bar'],
    ['fs_path_extname.js', '.js'],
    ['/path/to/file.js', '.js'],
    ['/path/to/file.js/foo', ''],
];

describe('fs_path_extname', function () {
    tests.forEach(function ([input, expected]) {
        it(`${input} -> ${expected}`, function () {
            const actual = fs_path_extname(input);
            assert.strictEqual(actual, expected);
        });
    });
});
