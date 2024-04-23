const stream = require('stream');

/**
 * Pass down only those items passed user-defined criteria.
 */
function stream_filter(fn)
{
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, callback) {
            try {
                if (fn(item)) {
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
