const Promise = require('bluebird');
const stream = require('stream');
const wait_while = require('./wait_while');

/**
 * Returns a writable stream for `bulkWrite` operations.
 */
function mongo_stream_write({collection, concurrency = 1})
{
    const errors = [];
    return new stream.Writable({
        objectMode: true,
        construct(next) {
            this.running = 0;
            next();
        },
        destroy: async function (error, next) {
            // Wait for in-flight bulkWrite operations before tearing down.
            await wait_while(() => this.running > 0);
            next(error);
        },
        write: async function (operations, enc, next) {
            if (errors.length) {
                next(errors[0]);
                return;
            }
            try {
                if (!Array.isArray(operations)) {
                    next(new Error('An array of objects is expected.'));
                    return;
                }
                await wait_while(() => this.running >= concurrency);
                this.running++;
                // Promise.try turns a synchronous throw from bulkWrite into a
                // rejection, so `running` is always decremented; otherwise
                // destroy/final would wait for it forever.
                Promise.try(() => collection.bulkWrite(operations)).catch(e => errors.push(e)).finally(() => this.running--);
                next();
            }
            catch (error) {
                next(error);
            }
        },
        final: async function (next) {
            // Wait for in-flight bulkWrite operations before checking `errors`,
            // otherwise an error from the last batch(es) would be silently
            // dropped and the stream would finish successfully.
            await wait_while(() => this.running > 0);
            if (errors.length) {
                next(errors[0]);
                return;
            }
            next();
        },
    });
}

module.exports = mongo_stream_write;
