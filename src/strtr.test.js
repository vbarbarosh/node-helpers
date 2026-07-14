const assert = require('assert');
const strtr = require('./strtr');

const items = [
    // Basic replacement
    ['hello world', {world: 'there'}, 'hello there'],
    ['aaa', {a: 'b'}, 'bbb'],
    ['abc', {a: '1', b: '2', c: '3'}, '123'],

    // Multiple occurrences
    ['a-b-a-b', {a: 'x'}, 'x-b-x-b'],

    // Longest key wins when keys overlap
    ['hello', {he: 'X', hell: 'Y'}, 'Yo'],
    ['hello', {hell: 'Y', he: 'X'}, 'Yo'],
    ['ababab', {ab: '1', aba: '2'}, '2b1'],

    // Single pass: replaced text is never scanned again
    ['ab', {a: 'b', b: 'c'}, 'bc'],
    ['x', {x: 'xx'}, 'xx'],

    // Replacement with empty string (deletion)
    ['hello', {l: ''}, 'heo'],

    // No matches
    ['hello', {z: 'q'}, 'hello'],

    // Empty map
    ['hello', {}, 'hello'],

    // Empty keys are ignored
    ['hello', {'': 'x'}, 'hello'],

    // Empty subject
    ['', {a: 'b'}, ''],
];

describe('strtr', function () {
    items.forEach(function ([subject, map, expected]) {
        it(`${JSON.stringify(subject)} ${JSON.stringify(map)} → ${JSON.stringify(expected)}`, function () {
            assert.strictEqual(strtr(subject, map), expected);
        });
    });
});
