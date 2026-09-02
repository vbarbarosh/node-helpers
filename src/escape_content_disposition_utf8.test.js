const assert = require('assert');
const escape_content_disposition_utf8 = require('./escape_content_disposition_utf8');
const http = require('http');

describe('escape_content_disposition_utf8', function () {
    [
        ['файл.txt', "UTF-8''%D1%84%D0%B0%D0%B9%D0%BB.txt"],
        ['foo bar.txt', "UTF-8''foo%20bar.txt"],
        ["a'b(c)*.txt", "UTF-8''a%27b%28c%29%2A.txt"],
        ['foo\rbar', "UTF-8''foo%0Dbar"],
    ].forEach(function ([input, expected]) {
        it(`${JSON.stringify(input)} → ${expected}`, function () {
            assert.strictEqual(escape_content_disposition_utf8(input), expected);
            http.validateHeaderValue('content-disposition', `attachment; filename*=${expected}`);
        });
    });
});
