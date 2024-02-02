const format_seconds = require('./format_seconds');

function eta(time0, total, done, resumed = 0)
{
    const seconds = (Date.now() - time0)/1000;
    const xdone = done - resumed;
    const xtotal = total - resumed;
    const bps = xdone/seconds;
    return format_seconds(xtotal/bps);
}

module.exports = eta;
