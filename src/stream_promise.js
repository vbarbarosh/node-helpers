const {finished} = require('stream/promises');

// /**
//  * Wait for a stream to finish with `await stream_promise(stream)`.
//  *
//  * @param stream
//  * @returns {Promise}
//  */
// function stream_promise(stream)
// {
//     /**
//      * https://stackoverflow.com/a/34310963/1478566
//      * > end and finish are the same event BUT on different types of
//      * > Streams.
//      * >   * stream.Readable fires ONLY end and NEVER finish
//      * >   * stream.Writable fires ONLY finish and NEVER end
//      */
//     return new Promise(function (resolve, reject) {
//         stream.once('end', resolve); // Stream.Readable
//         stream.once('finish', resolve); // Stream.Writable
//         stream.once('error', reject);
//         function end() { off(); resolve(); }
//         function finish() { off(); resolve(); }
//         function error() { off(); reject(); }
//         function off() {
//             stream.off('end', end);
//             stream.off('finish', finish);
//             stream.off('error', error);
//         }
//     });
// }

/**
 * Wait for a stream to finish with `await stream_promise(stream)`.
 *
 * https://nodejs.org/api/stream.html#stream_stream_finished_stream_options_callback
 * > Especially useful in error handling scenarios where a stream
 * > is destroyed prematurely (like an aborted HTTP request), and
 * > will not emit 'end' or 'finish'.
 *
 * @param stream
 * @returns {Promise<void>}
 */
function stream_promise(stream)
{
    // https://nodejs.org/api/stream.html#stream_stream_finished_stream_options_callback
    // > stream.finished() leaves dangling event listeners (in particular
    // > 'error', 'end', 'finish' and 'close') after callback has been
    // > invoked. The reason for this is so that unexpected 'error'
    // > events (due to incorrect stream implementations) do not cause
    // > unexpected crashes. If this is unwanted behavior then the
    // > returned cleanup function needs to be invoked in the callback:
    // >
    // >     const cleanup = finished(rs, (err) => {
    // >         cleanup();
    // >         // ...
    // >     });
    // >
    return finished(stream);
}

module.exports = stream_promise;
