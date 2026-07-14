const Promise = require('bluebird');
const assert = require('assert');
const parallel = require('./parallel');

describe('parallel', function () {
    it('should run all jobs', async function () {
        const done = [];
        let next = 0;
        await parallel({concurrency: 3, spawn});
        assert.deepStrictEqual(done.sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        function spawn() {
            if (next >= 10) {
                return null;
            }
            const num = next++;
            return Promise.delay(1).then(() => done.push(num));
        }
    });
    it('should reject when a job fails', async function () {
        let next = 0;
        await assert.rejects(parallel({concurrency: 2, spawn}), /boom/);
        function spawn() {
            if (next++ >= 5) {
                return null;
            }
            return Promise.delay(1).then(function () {
                if (next >= 3) {
                    throw new Error('boom');
                }
            });
        }
    });
    it('should reject when [spawn] is async function', function () {
        return assert.rejects(parallel({spawn: async function () {}}));
    });
    it('should reject when [spawn] is async generator', function () {
        return assert.rejects(parallel({spawn: async function* () {}}));
    });
    it('should reject when [spawn] throws synchronously on the first call', async function () {
        await assert.rejects(parallel({concurrency: 2, spawn: () => { throw new Error('boom'); }}), /boom/);
    });
    it('should reject when [spawn] throws synchronously during rescheduling', async function () {
        let n = 0;
        await assert.rejects(parallel({concurrency: 2, spawn}), /boom/);
        function spawn() {
            n++;
            if (n === 1) {
                return Promise.delay(1);
            }
            if (n === 2) {
                return null;
            }
            throw new Error('boom');
        }
    });
});
