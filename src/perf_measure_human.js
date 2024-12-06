const perf_end_human = require('./perf_end_human');
const perf_start = require('./perf_start');

async function perf_measure_human(fn, digits = 4)
{
    const time0 = perf_start();
    await fn();
    return perf_end_human(time0, digits);
}

module.exports = perf_measure_human;
