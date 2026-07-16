const assert = require('assert');
const shell_lines = require('./shell_lines');

const items = [
    // [label, script, expected]
    ['empty output → []', '', []],
    ['a single trailing newline → []', 'console.log()', []],
    ['single line', 'console.log("aaa")', ['aaa']],
    ['multiple lines', 'console.log("aaa\\nbbb\\nccc")', ['aaa', 'bbb', 'ccc']],
    ['trailing newlines are stripped', 'process.stdout.write("aaa\\nbbb\\n\\n\\n")', ['aaa', 'bbb']],
    ['empty lines in the middle are kept', 'process.stdout.write("aaa\\n\\nbbb\\n")', ['aaa', '', 'bbb']],
];

describe('shell_lines', function () {
    items.forEach(function ([label, script, expected]) {
        it(label, async function () {
            assert.deepStrictEqual(await shell_lines([process.execPath, '-e', script]), expected);
        });
    });
    it('should throw on non-zero exit code', async function () {
        await assert.rejects(shell_lines([process.execPath, '-e', 'process.exit(1)']));
    });
    it('should throw on stderr output', async function () {
        await assert.rejects(shell_lines([process.execPath, '-e', 'console.error("boom")']));
    });
});
