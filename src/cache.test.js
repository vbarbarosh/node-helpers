const assert = require('assert');
const cache = require('./cache');

describe('cache', function () {
    it('should return the cached value without refreshing', async function () {
        let refreshed = 0;
        const value = await cache({
            get: async () => 'cached',
            set: async () => { throw new Error('set must not be called'); },
            refresh: async () => ++refreshed,
        });
        assert.strictEqual(value, 'cached');
        assert.strictEqual(refreshed, 0);
    });
    it('should refresh and store when get fails', async function () {
        const stored = [];
        const value = await cache({
            get: async () => { throw new Error('miss'); },
            set: async v => stored.push(v),
            refresh: async () => 'fresh',
        });
        assert.strictEqual(value, 'fresh');
        assert.deepStrictEqual(stored, ['fresh']);
    });
    it('should reject when refresh fails', async function () {
        await assert.rejects(cache({
            get: async () => { throw new Error('miss'); },
            set: async () => {},
            refresh: async () => { throw new Error('boom'); },
        }), /boom/);
    });
    it('should reject when set fails', async function () {
        await assert.rejects(cache({
            get: async () => { throw new Error('miss'); },
            set: async () => { throw new Error('disk full'); },
            refresh: async () => 'fresh',
        }), /disk full/);
    });
});
