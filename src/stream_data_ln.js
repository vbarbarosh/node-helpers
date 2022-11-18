/**
 * Split stream on each \n and call `fn` for each line.
 *
 * @param stream
 * @param fn
 * @return function
 */
function stream_data_ln(stream, fn)
{
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
        if (utf8) {
            fn(utf8, true);
        }
    }
    function data(buffer) {
        utf8 += buffer.toString('utf8');
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
