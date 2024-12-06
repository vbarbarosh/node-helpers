const format_hrtime = require('./format_hrtime');

function perf_end_human(time0, digits = 4)
{
    return format_hrtime(time0, digits);
}

module.exports = perf_end_human;
