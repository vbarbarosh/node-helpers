const {StringDecoder} = require('string_decoder');

/**
 * Split stream on each \n and call `fn` for each line.
 *
 * @param stream
 * @param fn
 * @return function
 */
function stream_data_ln(stream, fn)
{
    // StringDecoder buffers a multi-byte character split across chunk
    // boundaries; plain buffer.toString('utf8') would corrupt it into �.
    const decoder = new StringDecoder('utf8');
    let utf8 = '';
    stream.on('data', data);
    stream.on('end', end);
    return off;

    function off() {
        stream.off('data', data);
        stream.off('end', end);
    }
    function end() {
        off();
        utf8 += decoder.end();
        if (utf8) {
            fn(utf8, true);
        }
    }
    function data(buffer) {
        utf8 += (typeof buffer === 'string') ? buffer : decoder.write(buffer);
        for (let iteration = 1; true; ++iteration) {
            if (iteration == 1000000) {
                throw new Error('Too many iterations');
            }
            const i = utf8.indexOf('\n');
            if (i == -1) {
                break;
            }
            const line = utf8.substr(0, i);
            utf8 = utf8.substr(i + 1);
            fn(line, false);
        }
    }
}

module.exports = stream_data_ln;
