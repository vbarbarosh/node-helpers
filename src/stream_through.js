const stream_tap = require('./stream_tap');

/**
 * Call `fn` on each item.
 *
 * @deprecated Deprecated in favor of `stream_tap`.
 */
function stream_through(fn)
{
    return stream_tap(fn);
}

module.exports = stream_through;
