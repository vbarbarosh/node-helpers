const assert = require('assert');
const edge_values = require('@vbarbarosh/type-helpers/src/edge_values');
const urlparts = require('./urlparts');

const extra_edge_values = [
    // whitespace strings
    {label: '" "', value: ' '},
    {label: '"\\t"', value: '\t'},
    {label: '"\\n"', value: '\n'},
    {label: '"\\r\\n"', value: '\r\n'},

    // numeric strings
    {label: '"0"', value: '0'},
    {label: '"1"', value: '1'},
    {label: '"NaN"', value: 'NaN'},
    {label: '"Infinity"', value: 'Infinity'},

    // weird unicode
    {label: '"💩"', value: '💩'},
    {label: '"😀"', value: '😀'},
    {label: '"привет"', value: 'привет'},
    {label: '"こんにちは"', value: 'こんにちは'},

    // dangerous chars
    {label: '"<script>"', value: '<script>'},
    {label: '"../"', value: '../'},
    {label: '"%20"', value: '%20'},
    {label: '"a?b=c"', value: 'a?b=c'},
    {label: '"a#b"', value: 'a#b'},

    // arrays
    {label: '[1,2,3]', value: [1, 2, 3]},
    {label: '[null]', value: [null]},
    {label: '[undefined]', value: [undefined]},
    {label: 'new Array(5)', value: new Array(5)},

    // typed arrays
    {label: 'Uint8Array', value: new Uint8Array([1, 2, 3])},
    {label: 'Buffer', value: Buffer.from('abc')},

    // objects
    {label: '{a:1}', value: {a: 1}},
    {label: 'Object.create(null)', value: Object.create(null)},

    // custom coercion
    {label: 'toString() => x', value: {toString() {return 'x';}}},
    {label: 'valueOf() => 123', value: {valueOf() {return 123;}}},

    // dates
    {label: 'new Date()', value: new Date()},
    {label: 'Invalid Date', value: new Date('invalid')},

    // regexp
    {label: '/foo/g', value: /foo/g},

    // maps/sets
    {label: 'Map', value: new Map()},
    {label: 'Set', value: new Set()},
    {label: 'WeakMap', value: new WeakMap()},
    {label: 'WeakSet', value: new WeakSet()},

    // promises
    {label: 'Promise.resolve(1)', value: Promise.resolve(1)},

    // errors
    {label: 'Error', value: new Error('boom')},
    {label: 'TypeError', value: new TypeError('boom')},

    // wrappers
    {label: 'new String()', value: new String('abc')},
    {label: 'new Number()', value: new Number(123)},
    {label: 'new Boolean()', value: new Boolean(false)},

    // url-like
    {label: 'new URL("https://example.com")', value: new URL('https://example.com')},

    // bigint
    {label: '1n', value: 1n},
    {label: '-1n', value: -1n},

    // special numbers
    {label: 'Number.EPSILON', value: Number.EPSILON},

    // proxy
    {label: 'Proxy', value: new Proxy({}, {})},
];

const happy_paths = [
    {
        label: 'full https url',
        input: 'https://john:secret@example.com:8080/users/15?page=2#top',
        expected: parts({
            protocol: 'https',
            username: 'john',
            password: 'secret',
            host: 'example.com',
            port: '8080',
            path: '/users/15',
            search: '?page=2',
            hash: '#top',
            query: {page: '2'},
            fragment: {top: ''},
        }),
    },
    {
        label: 'https url without auth',
        input: 'https://example.com/users',
        expected: parts({protocol: 'https', host: 'example.com', path: '/users'}),
    },
    {
        label: 'root url',
        input: 'https://example.com/',
        expected: parts({protocol: 'https', host: 'example.com', path: '/'}),
    },
    {
        label: 'relative path',
        input: '/users?page=5',
        expected: parts({path: '/users', search: '?page=5', query: {page: '5'}}),
    },
    {
        label: 'hash',
        input: 'https://example.com/docs#intro',
        expected: parts({
            protocol: 'https',
            host: 'example.com',
            path: '/docs',
            hash: '#intro',
            fragment: {intro: ''},
        }),
    },
    {
        label: 'query string',
        input: 'https://example.com?a=1&b=2',
        expected: parts({
            protocol: 'https',
            host: 'example.com',
            search: '?a=1&b=2',
            query: {a: '1', b: '2'},
        }),
    },
    {
        label: 'localhost with port',
        input: 'http://localhost:3000/foo',
        expected: parts({protocol: 'http', host: 'localhost', port: '3000', path: '/foo'}),
    },
    {
        label: 'ftp url',
        input: 'ftp://example.com/file.txt',
        expected: parts({protocol: 'ftp', host: 'example.com', path: '/file.txt'}),
    },
    {
        label: 'protocol-relative url',
        input: '//cdn.example.com/app.js?v=2',
        expected: parts({
            host: 'cdn.example.com',
            path: '/app.js',
            search: '?v=2',
            query: {v: '2'},
        }),
    },
    {
        label: 'bracketed ipv6 host',
        input: '//[::1]:8080/x',
        expected: parts({host: '[::1]', port: '8080', path: '/x'}),
    },
];

const urlmod_cases = [
    ['foo', parts({path: 'foo'})],
    ['?a=1#x', parts({search: '?a=1', hash: '#x', query: {a: '1'}, fragment: {x: ''}})],
    ['?a=1&a=2', parts({search: '?a=1&a=2', query: {a: '2'}})],
    ['#ex', parts({hash: '#ex', fragment: {ex: ''}})],
    ['#ex?a=1#ex', parts({hash: '#ex?a=1#ex', fragment: {'ex?a': '1#ex'}})],
    ['/#ex', parts({path: '/', hash: '#ex', fragment: {ex: ''}})],
    ['//', parts()],
    ['//foo', parts({host: 'foo'})],
    ['//[', parts({host: '['})],
    ['//]', parts({host: ']'})],
    ['//:', parts({port: ''})],
    ['//?', parts({search: '?'})],
    ['//#x', parts({hash: '#x', fragment: {x: ''}})],
    ['///', parts({path: '/'})],
    ['//cdn.example.com/app.js', parts({host: 'cdn.example.com', path: '/app.js'})],
    ['//cdn.example.com/app.js?v=1#x', parts({host: 'cdn.example.com', path: '/app.js', search: '?v=1', hash: '#x', query: {v: '1'}, fragment: {x: ''}})],
    ['//example.com/path#section', parts({host: 'example.com', path: '/path', hash: '#section', fragment: {section: ''}})],
    ['http://www.example.com/some/path?a=1#ex', parts({protocol: 'http', host: 'www.example.com', path: '/some/path', search: '?a=1', hash: '#ex', query: {a: '1'}, fragment: {ex: ''}})],
    ['http://localhost:3000/auth/sign-in', parts({protocol: 'http', host: 'localhost', port: '3000', path: '/auth/sign-in'})],
    ['HTTP://EXAMPLE.COM:80/a/../b', parts({protocol: 'http', host: 'EXAMPLE.COM', port: '80', path: '/a/../b'})],
    ['../images/logo.png', parts({path: '../images/logo.png'})],
    ['./foo', parts({path: './foo'})],
    ['a/../b', parts({path: 'a/../b'})],
    ['/foo/../bar', parts({path: '/foo/../bar'})],
    ['../api?old=1', parts({path: '../api', search: '?old=1', query: {old: '1'}})],
    ['../../api#frag', parts({path: '../../api', hash: '#frag', fragment: {frag: ''}})],
    ['\t//cdn.example/api', parts({path: '\t//cdn.example/api'})],
    ['xxx://___base___/file', parts({protocol: 'xxx', host: '___base___', path: '/file'})],
    ['xxx://___base___/api?x=1', parts({protocol: 'xxx', host: '___base___', path: '/api', search: '?x=1', query: {x: '1'}})],
    ['?x=%20', parts({search: '?x=%20', query: {x: ' '}})],
    ['?x=~', parts({search: '?x=~', query: {x: '~'}})],
    ['?x=%2f', parts({search: '?x=%2f', query: {x: '/'}})],
    ['?x=a%20b', parts({search: '?x=a%20b', query: {x: 'a b'}})],
    // A backslash ends the authority, matching the host WHATWG clients connect to.
    ['https://evil.com\\@good.com/x', parts({protocol: 'https', host: 'evil.com', path: '\\@good.com/x'})],
    ['https://good.com\\evil.com/x', parts({protocol: 'https', host: 'good.com', path: '\\evil.com/x'})],
];

// Malformed URLs should still be parsed on a best-effort basis.
const malformed_urls = [
    '',
    'http://[',
    'https://exa mple.com:invalid/path?bad=%',
    '://not-a-url?#',
    '//[',
    '//]',
    '//:',
    'http://example.com:99999/path',
    'https://user::password@@example.com/path',
    '?bad=%E0%A4%A',
    '\0://\0?\0#\0',
];

describe('urlparts', function () {

    describe('happy paths', function () {
        for (const item of happy_paths) {
            it(item.label, function () {
                assert.deepStrictEqual(urlparts(item.input), item.expected);
            });
        }
    });

    describe('url forms covered by urlmod', function () {
        for (const [input, expected] of urlmod_cases) {
            it(JSON.stringify(input), function () {
                assert.deepStrictEqual(urlparts(input), expected);
            });
        }
    });

    it('parses query-only, hash-only, and relative forms', function () {
        assert.deepStrictEqual(urlparts('?a=1'), parts({search: '?a=1', query: {a: '1'}}));
        assert.deepStrictEqual(urlparts('#top'), parts({hash: '#top', fragment: {top: ''}}));
        assert.deepStrictEqual(urlparts('users?a=1'), parts({path: 'users', search: '?a=1', query: {a: '1'}}));
    });

    it('returns null for every missing component', function () {
        assert.deepStrictEqual(urlparts(''), parts());
    });

    it('extracts usable components from malformed url text', function () {
        assert.deepStrictEqual(urlparts('http://['), parts({protocol: 'http', host: '['}));
        assert.deepStrictEqual(
            urlparts('https://example.com:invalid/path?bad=%'),
            parts({
                protocol: 'https',
                host: 'example.com',
                port: 'invalid',
                path: '/path',
                search: '?bad=%',
                query: {bad: '%'},
            }),
        );
    });

    describe('malformed url text', function () {
        for (const input of malformed_urls) {
            it(JSON.stringify(input), function () {
                const parts = urlparts(input);
                assert.deepStrictEqual(Object.keys(parts), [
                    'protocol',
                    'username',
                    'password',
                    'host',
                    'port',
                    'path',
                    'search',
                    'hash',
                    'query',
                    'fragment',
                ]);
            });
        }
    });

    it('uses the last duplicate query value', function () {
        assert.deepStrictEqual(urlparts('?a=1&a=2').query, {a: '2'});
        assert.deepStrictEqual(urlparts('?a=1&a').query, {a: ''});
    });

    it('normalizes absent query parameter values to empty strings', function () {
        assert.deepStrictEqual(urlparts('?flag&empty=&value=1').query, {
            flag: '',
            empty: '',
            value: '1',
        });
    });

    it('parses fragment parameters', function () {
        assert.deepStrictEqual(urlparts('#flag&empty=&value=1'), parts({
            hash: '#flag&empty=&value=1',
            fragment: {
                flag: '',
                empty: '',
                value: '1',
            },
        }));
    });

    describe('special parameter keys', function () {
        const input = '__proto__=a&constructor=b&prototype=c&toString=d&hasOwnProperty=e';

        it('preserves special query keys as own properties', function () {
            assert_special_params(urlparts(`?${input}`).query);
        });

        it('preserves special fragment keys as own properties', function () {
            assert_special_params(urlparts(`#${input}`).fragment);
        });

        it('uses the last __proto__ value without changing the object prototype', function () {
            const query = urlparts('?__proto__=first&__proto__=last').query;
            assert.strictEqual(query.__proto__, 'last');
            assert.strictEqual(Object.getPrototypeOf(query), Object.prototype);
        });
    });

    it('distinguishes empty query and fragment delimiters from missing ones', function () {
        assert.deepStrictEqual(urlparts('?#'), parts({search: '?', hash: '#'}));
    });

    describe('edge values', function () {
        for (const item of [...edge_values, ...extra_edge_values]) {
            it(item.label, function () {
                if (typeof item.value !== 'string') {
                    assert.deepStrictEqual(urlparts(item.value), parts());
                }
                else {
                    const parts = urlparts(item.value);
                    assert.deepStrictEqual(Object.keys(parts), [
                        'protocol',
                        'username',
                        'password',
                        'host',
                        'port',
                        'path',
                        'search',
                        'hash',
                        'query',
                        'fragment',
                    ]);
                }
            });
        }
    });
});

function parts(overrides = {})
{
    return Object.assign({
        protocol: null,
        username: null,
        password: null,
        host: null,
        port: null,
        path: null,
        search: null,
        hash: null,
        query: {},
        fragment: {},
    }, overrides);
}

function assert_special_params(actual)
{
    assert.deepStrictEqual(Object.keys(actual), [
        '__proto__',
        'constructor',
        'prototype',
        'toString',
        'hasOwnProperty',
    ]);
    assert.strictEqual(actual.__proto__, 'a');
    assert.strictEqual(actual.constructor, 'b');
    assert.strictEqual(actual.prototype, 'c');
    assert.strictEqual(actual.toString, 'd');
    assert.strictEqual(actual.hasOwnProperty, 'e');
    assert.strictEqual(Object.getPrototypeOf(actual), Object.prototype);
}
