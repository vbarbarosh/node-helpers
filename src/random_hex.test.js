const assert = require('assert');
const random_hex = require('./random_hex');

describe('random_hex', function () {
    it('returns 2 hex characters per requested byte', function () {
        [1, 2, 8, 16, 32].forEach(function (bytes) {
            for (let i = 0; i < 50; i++) {
                const hex = random_hex(bytes);
                assert.strictEqual(typeof hex, 'string');
                assert.strictEqual(hex.length, bytes*2);
                assert.match(hex, /^[0-9a-f]+$/);
            }
        });
    });

    it('defaults to 32 bytes (64 hex characters)', function () {
        const hex = random_hex();
        assert.strictEqual(hex.length, 64);
        assert.match(hex, /^[0-9a-f]+$/);
    });

    it('returns an empty string for 0 bytes', function () {
        assert.strictEqual(random_hex(0), '');
    });
});
