const stream = require('stream');

/**
 * Skip first `n` records.
 */
function stream_skip(n)
{
    let current = 0;
    return new stream.Transform({
        objectMode: true,
        transform: function (item, encoding, callback) {
            try {
                if (current++ >= n) {
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

module.exports = stream_skip;
