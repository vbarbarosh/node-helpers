const assert = require('assert');
const pending = require('./pending');

describe('pending', function () {
    it('resolves via promise.resolve', async function () {
        const promise = pending();
        promise.resolve('aa');
        assert.strictEqual(await promise, 'aa');
    });

    it('rejects via promise.reject', async function () {
        const promise = pending();
        promise.reject(new Error('bb'));
        await assert.rejects(promise, {message: 'bb'});
    });

    it('resolves via promise.callback(null, data)', async function () {
        const promise = pending();
        promise.callback(null, 'cc');
        assert.strictEqual(await promise, 'cc');
    });

    it('rejects via promise.callback(error)', async function () {
        const promise = pending();
        promise.callback(new Error('dd'));
        await assert.rejects(promise, {message: 'dd'});
    });

    it('passes callback to fn', async function () {
        const promise = pending(callback => callback(null, 'ee'));
        assert.strictEqual(await promise, 'ee');
    });

    it('ignores non-function fn', async function () {
        const promise = pending('not a function');
        promise.resolve('ff');
        assert.strictEqual(await promise, 'ff');
    });
});
