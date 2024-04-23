const stream = require('stream');

/**
 * Pass each item to a simple function. This is a final step.
 */
function stream_each(fn)
{
    return stream.Writable({
        objectMode: true,
        write: function (item, encoding, callback) {
            fn(item);
            callback();
        }
    });
}

module.exports = stream_each;
