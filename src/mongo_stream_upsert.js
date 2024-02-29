const Promise = require('bluebird');
const stream = require('stream');
const wait_while = require('./wait_while');

/**
 * Returns a writable stream for inserting or replacing documents in mongo collection.
 */
function mongo_stream_upsert({collection, concurrency = 1})
{
    const errors = [];
    return new stream.Writable({
        objectMode: true,
        construct(next) {
            this.running = 0;
            next();
        },
        destroy: async function (error, next) {
            await wait_while(() => this.running > 0);
            next();
        },
        write: async function (items, enc, next) {
            if (errors.length) {
                next(errors[0]);
                return;
            }
            try {
                if (!Array.isArray(items)) {
                    next(new Error('An array of objects is expected.'));
                    return;
                }
                await wait_while(() => this.running >= concurrency);
                const operations = items.map(function (item) {
                    return {
                        replaceOne: {
                            filter: {_id: item._id},
                            replacement: item,
                            upsert: true,
                        },
                    };
                });
                this.running++;
                Promise.resolve(collection.bulkWrite(operations)).catch(e => errors.push(e)).finally(() => this.running--);
                next();
            }
            catch (error) {
                next(error);
            }
        },
        final: async function (next) {
            if (errors.length) {
                next(errors[0]);
                return;
            }
            await wait_while(() => this.running > 0);
            next();
        },
    });
}

module.exports = mongo_stream_upsert;
