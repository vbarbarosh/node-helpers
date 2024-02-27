const Promise = require('bluebird');
const stream = require('stream');
const wait_while = require('./wait_while');

/**
 * Returns a writable stream for upsert mongo collection.
 */
function mongo_stream_upsert({collection, concurrency = 1})
{
    return new stream.Writable({
        objectMode: true,
        construct(next) {
            this.running = 0;
            next();
        },
        write: async function (items, enc, next) {
            try {
                if (!Array.isArray(items)) {
                    next(new Error('An array of objects is expected.'));
                    return;
                }
                await wait_while(() => this.running >= concurrency);
                const operations = items.map(function (item) {
                    return {replaceOne: {filter: {_id: item._id}, replacement: item, upsert: true}};
                });
                this.running++;
                Promise.resolve(collection.bulkWrite(operations, {multi: true})).finally(() => this.running--);
                next();
            }
            catch (error) {
                next(error);
            }
        },
        final: async function (next) {
            await wait_while(() => this.running > 0);
            next();
        },
    });
}

module.exports = mongo_stream_upsert;
