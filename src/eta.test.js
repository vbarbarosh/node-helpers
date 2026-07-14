const assert = require('assert');
const eta = require('./eta');

describe('eta', function () {
    it('should format the remaining time', function () {
        assert.strictEqual(eta(Date.now() - 10000, 100, 50), '00:00:10');
    });
    it('should account for a resumed download', function () {
        assert.strictEqual(eta(Date.now() - 10000, 100, 60, 20), '00:00:10');
    });
    it('should return a placeholder when no progress was made yet', function () {
        assert.strictEqual(eta(Date.now() - 5000, 100, 0), '--:--:--');
        assert.strictEqual(eta(Date.now(), 100, 0), '--:--:--');
    });
});
