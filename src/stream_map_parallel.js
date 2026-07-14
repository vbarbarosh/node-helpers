const Promise = require('bluebird');
const stream = require('stream');

/**
 * Transform each item using a simple function in parallel.
 *
 * Returning null or undefined from `handler` drops the item: streams cannot
 * carry null (it is an eof mark), so pushing it would end the stream and
 * silently discard everything after it.
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
            const value = buf.shift().value();
            // null is an eof mark, pushing it would end the stream
            if (value !== null && value !== undefined) {
                out.push(value);
            }
        }
        if (callback_next && buf.length < buf_limit) {
            const tmp = callback_next;
            callback_next = null;
            tmp();
        }
        if (callback_flush && !running) {
            callback_flush();
        }
    }
    function fail(error) {
        out.destroy(error);
    }
}

module.exports = stream_map_parallel;
