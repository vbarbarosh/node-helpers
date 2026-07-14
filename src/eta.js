const format_seconds = require('./format_seconds');

function eta(time0, total, done, resumed = 0)
{
    const seconds = (Date.now() - time0)/1000;
    const remained = total - done;
    const bps = (done - resumed)/seconds;
    const seconds_remained = remained/bps;
    // No progress yet (e.g. the first tick of a progress loop): remained/bps
    // is Infinity or NaN, which format_seconds renders as 0Infinity:0NaN:0NaN
    if (!Number.isFinite(seconds_remained)) {
        return '--:--:--';
    }
    return format_seconds(seconds_remained);
}

module.exports = eta;
