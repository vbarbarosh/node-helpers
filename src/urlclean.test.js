const assert = require('assert');
const urlclean = require('./urlclean');

const items = [
    ['', ''],
    ['http://127.0.0.1:3000/proxy', 'http://127.0.0.1:3000/proxy'],
    ['http://127.0.0.1:3000/proxy?url=http://127.0.0.1:3000/static/&redirects=2', 'http://127.0.0.1:3000/proxy?url=http://127.0.0.1:3000/static/&redirects=2'],
    ['http://127.0.0.1:3000/proxy?url=http%3A%2F%2F127.0.0.1%3A3000%2Fstatic%2F&redirects=1', 'http://127.0.0.1:3000/proxy?url=http://127.0.0.1:3000/static/&redirects=1'],
];

describe('urlclean', function () {
    items.forEach(function ([input, expected]) {
        it(input, function () {
            const actual = urlclean(input);
            assert.strictEqual(actual, expected);
        });
    });
});
