const stream_strpbrk = require('./stream_strpbrk');

/**
 * Split stream into lines
 */
function stream_lines()
{
    return stream_strpbrk('\r\n');
}

module.exports = stream_lines;
