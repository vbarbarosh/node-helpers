const assert = require('assert');
const wait_while = require('./wait_while');

describe('wait_while', function () {
    it('should resolve as soon as fn turns falsy', async function () {
        let n = 0;
        await wait_while(() => ++n < 3);
        assert.strictEqual(n, 3);
    });
    it('should support an async fn', async function () {
        let n = 0;
        await wait_while(async () => ++n < 3);
        assert.strictEqual(n, 3);
    });
    it('should reject when fn throws', async function () {
        await assert.rejects(wait_while(() => { throw new Error('boom'); }), /boom/);
    });
});
