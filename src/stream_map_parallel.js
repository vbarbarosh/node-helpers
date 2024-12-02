const Promise = require('bluebird');
const stream = require('stream');

/**
 * Transform each item by simple function in parallel.
 */
function stream_map_parallel({handler, concurrency})
{
    let running = 0;
    let callback_next = null;
    let callback_flush = null;
    const buf = [];
    const buf_limit = 5*concurrency;
    const out = new stream.Transform({
        objectMode: true,
        transform: async function (item, encoding, callback) {
            try {
                running++;
                const promise = Promise.method(handler).call(null, item);
                promise.then(ready).catch(fail);
                buf.push(promise);
                if (running < concurrency && buf.length < buf_limit) {
                    callback(); // Ready to consume the next item
                }
                else if (callback_next) {
                    throw new Error('Already pending');
                }
                else {
                    callback_next = callback;
                }
            }
            catch (error) {
                callback(error);
            }
        },
        flush: function (callback) {
            if (buf.length === 0) {
                callback();
            }
            else {
                callback_flush = callback;
            }
        },
    });
    return out;
    function ready() {
        running--;
        while (buf.length && buf[0].isFulfilled()) {
            out.push(buf.shift().value());
        }
        if (callback_next && buf.length < buf_limit) {
            const tmp = callback_next;
            callback_next = null;
            tmp();
        }
        if (callback_flush && !buf.length) {
            callback_flush();
        }
    }
    function fail(error) {
        throw error;
    }
}

module.exports = stream_map_parallel;
