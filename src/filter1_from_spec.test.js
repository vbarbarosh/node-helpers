const assert = require('assert');
const filter1_from_spec = require('./filter1_from_spec');

const scenarios = [
    // Format: [spec, input, expected, description]
    ['substr', 'this is a substr example', true, 'Single substring match'],
    ['^start', 'start of the string', true, 'Starts with substring'],
    ['end$', 'this is the end', true, 'Ends with substring'],
    ['!foo', 'this string does not contain it', true, 'Does not contain substring'],
    ['^start/end$', 'start and end', true, 'Starts and ends with substrings'],
    ['substr1/substr2', 'contains substr1 and substr2', true, 'Two matches'],
    ['substr1/substr2/substr3', 'contains substr1, substr2, and substr3', true, 'Three matches'],
    ['substr1/substr2/substr3/substr4', 'contains substr1, substr2, substr3, and substr4', true, 'Four matches'],
    ['substr1/substr2/substr3/substr4/substr5', 'contains substr1, substr2, substr3, substr4, substr5', true, 'Five matches'],
    ['!not1/!not2', 'this string avoids nota and notb', true, 'Does not contain multiple substrings'],
    ['^start1/^start2', 'start1 followed by start2', false, 'Conflicting start substrings'],
    ['end1$/end2$', 'ends with end1 or end2', false, 'Conflicting end substrings'],
    ['^start1/!substr1', 'start1 without substr', true, 'Starts with start1 and have no substr1'],
    ['substr/!not', 'contains substr but no ...', true, 'Combination of positive and negative substrings'],
    ['!missing', 'this string does not mention it', true, 'Negative substring absent'],
    ['missing', 'this string does not mention it', false, 'Substring missing']
];

describe('filter1_from_spec', function () {
    scenarios.forEach(function ([spec, input, expected, description]) {
        it(`${description || spec}`, function () {
            const filter = filter1_from_spec(spec);
            assert.strictEqual(filter(input), expected, description);
        });
    });
});
