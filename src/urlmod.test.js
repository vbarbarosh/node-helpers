const assert = require('assert');
const urlmod = require('./urlmod');

const location = {
    toString: function () {
        return 'http://www.example.com/some/path?a=1';
    },
};

const use_cases = [
    [undefined, undefined, '', 'no arguments'],
    ['', {a: 1}, '?a=1', 'empty URL'],
    ['foo', {a: 1}, 'foo?a=1', 'plain relative path'],
    ['?a=1', undefined, '?a=1'],
    ['?a=1', {a: 2}, '?a=2'],
    ['?a=1', {a: null}, ''],
    ['?a=1#x', {a: null}, '#x', 'delete query and retain fragment'],
    ['?a=1&a=2', {a: 3}, '?a=3', 'replace duplicate parameter'],
    ['?a=1', {b: 1}, '?a=1&b=1'],
    ['?a=1', {b: 1, a: 2}, '?a=2&b=1'],
    ['?a=1', {a: true}, '?a=1', 'true becomes 1'],
    ['?a=1', {a: false, b: true}, '?a=0&b=1', 'booleans become 0 or 1'],
    [location, {b: 2}, 'http://www.example.com/some/path?a=1&b=2', 'URL-like object'],
    ['#ex', {b: 2}, '?b=2#ex', 'fragment'],
    ['#ex?a=1#ex', {b: 2}, '?b=2#ex?a=1#ex', 'question mark inside fragment'],
    ['?a=1#ex', {b: 2}, '?a=1&b=2#ex', 'query and fragment'],
    ['/#ex', {b: 2}, '/?b=2#ex', 'root path and fragment'],
    ['//', {a: 1}, '//?a=1', 'double slash'],
    ['//foo', {a: 1}, '//foo?a=1', 'double slash with host'],
    ['//[', {a: 1}, '//[?a=1', 'double slash with opening bracket'],
    ['//]', {a: 1}, '//]?a=1', 'double slash with closing bracket'],
    ['//:', {a: 1}, '//:?a=1', 'double slash with colon'],
    ['//?', {a: 1}, '//?a=1', 'double slash with empty query'],
    ['//#x', {a: 1}, '//?a=1#x', 'double slash with fragment'],
    ['///', {a: 1}, '///?a=1', 'triple slash'],
    ['//[::1]:8080/x', {a: 1}, '//[::1]:8080/x?a=1', 'protocol-relative IPv6 URL'],
    ['//cdn.example.com/app.js', {v: 2}, '//cdn.example.com/app.js?v=2', 'protocol-relative URL'],
    ['//cdn.example.com/app.js?v=1#x', {v: 2}, '//cdn.example.com/app.js?v=2#x', 'protocol-relative URL with fragment'],
    ['http://www.example.com/some/path?a=1#ex', {b: 2}, 'http://www.example.com/some/path?a=1&b=2#ex', 'absolute URL with fragment'],
    ['http://localhost:3000/auth/sign-in', {return: '/auth/profile'}, 'http://localhost:3000/auth/sign-in?return=%2Fauth%2Fprofile', 'port and encoded parameter'],
    ['../api?old=1', {old: 2}, '../api?old=2', 'parent-relative path'],
    ['../../api#frag', {x: 1}, '../../api?x=1#frag', 'multiple parent-relative segments'],
    ['\t//cdn.example/api', {x: 1}, '\t//cdn.example/api?x=1', 'leading whitespace'],
    ['xxx://___base___/api?x=1', {y: 2}, 'xxx://___base___/api?x=1&y=2', 'URL matching the old sentinel'],
    ['?x=a%20b', {}, '?x=a%20b', 'empty params preserve input byte-for-byte'],
];

describe('urlmod', function () {
    use_cases.forEach(function ([input_url, params, expected_url, label]) {
        it(label || `${input_url} → ${expected_url}`, function () {
            assert.strictEqual(urlmod(input_url, params), expected_url);
        });
    });
});
