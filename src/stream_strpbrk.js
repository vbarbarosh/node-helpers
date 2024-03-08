const stream = require('stream');

/**
 * Split input stream by consecutive delimiters in `chars`.
 */
function stream_strpbrk(chars = '\r\n')
{
    const pending = [];
    return new stream.Transform({
        objectMode: true,
        transform: function (str, encoding, next) {
            str = Buffer.isBuffer(str) ? str.toString() : str;

            let off = 0;
            // leading delimiters
            while (off < str.length) {
                if (!chars.includes(str[off])) {
                    break;
                }
                off++;
            }

            if (off && pending.length) {
                this.push(''.concat(...pending.splice(0)));
            }

            while (off < str.length) {
                // skip consecutive delimiters
                while (off < str.length) {
                    let stop = true;
                    for (let i = 0, end = chars.length; i < end; ++i) {
                        if (str[off] === chars[i]) {
                            off++;
                            stop = false;
                            break;
                        }
                    }
                    if (stop) {
                        break;
                    }
                }

                // find next delimiter
                const delims = [];
                for (let i = 0, end = chars.length; i < end; ++i) {
                    const j = str.indexOf(chars[i], off);
                    if (j !== -1) {
                        delims.push(j);
                    }
                }

                // no delimiters were found
                if (!delims.length) {
                    const tmp = str.slice(off);
                    if (tmp.length) {
                        pending.push(tmp);
                    }
                    next();
                    return;
                }

                delims.sort(fcmp);
                pending.push(str.slice(off, delims[0]));
                this.push(''.concat(...pending.splice(0)));
                off = delims[0];
            }
            next();
        },
        flush: function (next) {
            if (pending.length) {
                this.push(''.concat(...pending.splice(0)));
            }
            next();
        },
    });
}

function fcmp(a, b)
{
    return a - b;
}

module.exports = stream_strpbrk;
