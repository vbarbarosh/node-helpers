const stream_chunk = require('./stream_chunk');

/**
 * Split a stream into chunks of objects.
 *
 * @deprecated Deprecated in favor of `stream_chunk`
 */
function stream_group(chunk_size)
{
    return stream_chunk(chunk_size);
}

module.exports = stream_group;
