const assert = require('assert');
const urlmod = require('./urlmod');

const location = {
    toString: function () {
        return 'http://www.example.com/some/path?a=1';
    },
};

const items = [
    // Empty and missing input
    [undefined, undefined, ''],
    ['', {a: 1}, '?a=1'],
    ['?a=1', undefined, '?a=1'],

    // Add, update, and remove query parameters
    ['foo', {a: 1}, 'foo?a=1'],
    ['?a=1', {a: 2}, '?a=2'],
    ['?a=1', {a: null}, ''],
    ['?a=1#x', {a: null}, '#x'],
    ['?a=1&a=2', {a: 3}, '?a=3'],
    ['?a=1', {b: 1}, '?a=1&b=1'],
    ['?a=1', {b: 1, a: 2}, '?a=2&b=1'],

    // Boolean values
    ['?a=1', {a: true}, '?a=1'],
    ['?a=1', {a: false, b: true}, '?a=0&b=1'],

    // URL-like objects
    [location, {b: 2}, 'http://www.example.com/some/path?a=1&b=2'],

    // Fragments
    ['#ex', {b: 2}, '?b=2#ex'],
    ['#ex?a=1#ex', {b: 2}, '?b=2#ex?a=1#ex'],
    ['?a=1#ex', {b: 2}, '?a=1&b=2#ex'],
    ['/#ex', {b: 2}, '/?b=2#ex'],

    // Slash-prefixed and protocol-relative URLs
    ['//', {a: 1}, '//?a=1'],
    ['//foo', {a: 1}, '//foo?a=1'],
    ['//[', {a: 1}, '//[?a=1'],
    ['//]', {a: 1}, '//]?a=1'],
    ['//:', {a: 1}, '//:?a=1'],
    ['//?', {a: 1}, '//?a=1'],
    ['//#x', {a: 1}, '//?a=1#x'],
    ['///', {a: 1}, '///?a=1'],
    ['//[::1]:8080/x', {a: 1}, '//[::1]:8080/x?a=1'],
    ['//cdn.example.com/app.js', {v: 2}, '//cdn.example.com/app.js?v=2'],
    ['//cdn.example.com/app.js?v=1#x', {v: 2}, '//cdn.example.com/app.js?v=2#x'],

    // Absolute and relative URLs
    ['http://www.example.com/some/path?a=1#ex', {b: 2}, 'http://www.example.com/some/path?a=1&b=2#ex'],
    ['http://localhost:3000/auth/sign-in', {return: '/auth/profile'}, 'http://localhost:3000/auth/sign-in?return=%2Fauth%2Fprofile'],
    ['../api?old=1', {old: 2}, '../api?old=2'],
    ['../../api#frag', {x: 1}, '../../api?x=1#frag'],

    // Inputs which the old URL-sentinel implementation could not preserve
    ['\t//cdn.example/api', {x: 1}, '\t//cdn.example/api?x=1'],
    ['xxx://___base___/api?x=1', {y: 2}, 'xxx://___base___/api?x=1&y=2'],

    // Empty params preserve the input byte-for-byte
    ['?x=a%20b', {}, '?x=a%20b'],
];

describe('urlmod', function () {
    items.forEach(function ([input_url, params, expected_url]) {
        it(`${JSON.stringify(input_url)} ${JSON.stringify(params)} → ${JSON.stringify(expected_url)}`, function () {
            assert.strictEqual(urlmod(input_url, params), expected_url);
        });
    });
});
