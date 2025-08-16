const array_sort = require('./array_sort');
const assert = require('assert');
const fs_path_extname = require('./fs_path_extname');

describe('array_sort', function () {
    it('should handle basic input', function () {
        assert.deepStrictEqual(array_sort([5,4,3,2,1], v => [v]), [1,2,3,4,5]);
        assert.deepStrictEqual(array_sort([5,4,3,2,1], v => [v]), [1,2,3,4,5]);
        assert.deepStrictEqual(array_sort([{id:5},{id:4},{id:3},{id:2},{id:1}], v => [v.id]), [{id:1},{id:2},{id:3},{id:4},{id:5}]);
    });
    it('should handle sort by priorities', function () {
        assert.deepStrictEqual(array_sort([1,2,3,4,5], v => [[5].indexOf(v) >>> 0]), [5,1,2,3,4]);
        assert.deepStrictEqual(array_sort([{id:1},{id:2},{id:3},{id:4},{id:5}], v => [[5].indexOf(v.id) >>> 0]), [{id:5},{id:1},{id:2},{id:3},{id:4}]);
    });
    it('should handle sort by priorities #2', function () {
        const files = [
            {name: 'README.md', size: 1024, type: 'file'},
            {name: 'package.json', size: 860, type: 'file'},
            {name: 'src', size: 0, type: 'dir'},
            {name: 'src/index.js', size: 2048, type: 'file'},
            {name: 'src/utils', size: 0, type: 'dir'},
            {name: 'src/utils/helpers.js', size: 1536, type: 'file'},
            {name: 'node_modules', size: 0, type: 'dir'},
            {name: 'LICENSE', size: 1078, type: 'file'},
        ];
        const expected = [
            {name: 'node_modules', size: 0, type: 'dir'},
            {name: 'src', size: 0, type: 'dir'},
            {name: 'src/utils', size: 0, type: 'dir'},
            {name: 'LICENSE', size: 1078, type: 'file'},
            {name: 'README.md', size: 1024, type: 'file'},
            {name: 'package.json', size: 860, type: 'file'},
            {name: 'src/index.js', size: 2048, type: 'file'},
            {name: 'src/utils/helpers.js', size: 1536, type: 'file'},
        ];
        const actual = array_sort(files, v => [pri_start(v.type, ['dir']), v.name]);
        assert.deepStrictEqual(actual, expected);
    });
    it('sort by name, directory first; .js, then .txt, then all the reset', function () {
        const files = [
            {name: 'docs', type: 'dir', size: 0},
            {name: 'zeta.txt', type: 'file', size: 1200},
            {name: 'alpha.js', type: 'file', size: 1500},
            {name: 'src', type: 'dir', size: 0},
            {name: 'readme.txt', type: 'file', size: 800},
            {name: 'beta.js', type: 'file', size: 1600},
            {name: 'build', type: 'dir', size: 0},
            {name: 'build.foo.js', type: 'dir', size: 0},
            {name: 'build.foo.md', type: 'dir', size: 0},
            {name: 'build.foo.txt', type: 'dir', size: 0},
            {name: 'notes.md', type: 'file', size: 400},
            {name: 'zeta.js', type: 'file', size: 1000},
            {name: 'config', type: 'dir', size: 0},
        ];
        const expected = [
            {name: 'build.foo.js', type: 'dir', size: 0},
            {name: 'build.foo.txt', type: 'dir', size: 0},
            {name: 'build', type: 'dir', size: 0},
            {name: 'build.foo.md', type: 'dir', size: 0},
            {name: 'config', type: 'dir', size: 0},
            {name: 'docs', type: 'dir', size: 0},
            {name: 'src', type: 'dir', size: 0},
            {name: 'alpha.js', type: 'file', size: 1500},
            {name: 'beta.js', type: 'file', size: 1600},
            {name: 'zeta.js', type: 'file', size: 1000},
            {name: 'readme.txt', type: 'file', size: 800},
            {name: 'zeta.txt', type: 'file', size: 1200},
            {name: 'notes.md', type: 'file', size: 400},
        ];
        array_sort(files, v => [pri_start(v.type, ['dir']), pri_start(fs_path_extname(v.name), ['.js', '.txt']), v.name])
        assert.deepStrictEqual(files, expected);
    });
});

// priorities.indexOf(v) >>> 0
function pri_start(value, array)
{
    const i = array.indexOf(value);
    return i === -1 ? array.length : i;
}

function pri_end(value, array)
{
    return array.indexOf(value);
}
