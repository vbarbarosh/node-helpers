const assert = require('assert');
const redis_connect = require('./redis_connect');

describe('redis_connect', function () {
    // A connection test needs a live redis server; this only guards against
    // the `redis` package going missing from optionalDependencies again.
    it('should be requirable without a live redis', function () {
        assert.strictEqual(typeof redis_connect, 'function');
    });
});
