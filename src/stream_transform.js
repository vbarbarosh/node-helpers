const stream_map = require('./stream_map');

/**
 * @deprecated Deprecated in favor of `stream_map`
 */
function stream_transform(fn)
{
    return stream_map(fn);
}

module.exports = stream_transform;
