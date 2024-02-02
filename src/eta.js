const format_seconds = require('./format_seconds');

function eta(time0, total, done, resumed = 0)
{
    const seconds = (Date.now() - time0)/1000;
    const remained = total - done;
    const bps = (done - resumed)/seconds;
    return format_seconds(remained/bps);
}

module.exports = eta;
