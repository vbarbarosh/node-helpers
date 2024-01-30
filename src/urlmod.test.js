const assert = require('assert');
const urlmod = require('./urlmod');

describe('urlmod', function () {
    it('should take no args', function () {
        assert.deepEqual(urlmod(), '');
    });
    it('should take basic args', function () {
        assert.deepEqual(urlmod('?a=1'), '?a=1');
        assert.deepEqual(urlmod('?a=1', {a: 2}), '?a=2');
        assert.deepEqual(urlmod('?a=1', {a: null}), '');
        assert.deepEqual(urlmod('?a=1', {b: 1}), '?a=1&b=1');
        assert.deepEqual(urlmod('?a=1', {b: 1, a: 2}), '?a=2&b=1');
        assert.deepEqual(urlmod('?a=1', {a: true}), '?a=1');
        assert.deepEqual(urlmod('?a=1', {a: false, b: true}), '?a=0&b=1');
    });
    it('should take `location`', function () {
        // const elem = document.createElement('A');
        // elem.href = 'http://www.example.com/some/path?a=1';
        // const location = elem.href;
        const location = {
            toString: function () {
                return 'http://www.example.com/some/path?a=1';
            },
        };
        assert.deepEqual(urlmod(location, {b: 2}), 'http://www.example.com/some/path?a=1&b=2');
    });
    it('should keep hash part', function () {
        assert.deepEqual(urlmod('#ex', {b: 2}), '?b=2#ex');
        assert.deepEqual(urlmod('#ex?a=1#ex', {b: 2}), '?b=2#ex?a=1#ex');
        assert.deepEqual(urlmod('?a=1#ex', {b: 2}), '?a=1&b=2#ex');
        assert.deepEqual(urlmod('/#ex', {b: 2}), '/?b=2#ex');
        assert.deepEqual(urlmod('http://www.example.com/some/path?a=1#ex', {b: 2}), 'http://www.example.com/some/path?a=1&b=2#ex');
    });
});
