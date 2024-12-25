const format_hrtime = require('./format_hrtime');
const perf_start = require('./perf_start');

async function perf_measure(fn, digits = 4)
{
    const time0 = perf_start();
    const out = {
        value: await fn(),
    };
    const [u, v] = process.hrtime(time0);
    out.time_ms = Math.round((u + v/1E9)*1000);
    out.time_human = format_hrtime([u ,v], digits)
    return out;
}

module.exports = perf_measure;
