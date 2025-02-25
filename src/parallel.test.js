const assert = require('assert');
const parallel = require('./parallel');

describe('parallel', function () {
    it('should reject when [spawn] is async function', function () {
        assert.rejects(parallel({spawn: async function () {}}));
    })
    it('should reject when [spawn] is async generator', function () {
        assert.rejects(parallel({spawn: async function* () {}}));
    })
});
