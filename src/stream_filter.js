const stream = require('stream');

/**
 * Pass down only those items passed user-defined criteria.
 */
function stream_filter(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                if (await fn(item)) {
                    this.push(item);
                }
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
}

module.exports = stream_filter;
