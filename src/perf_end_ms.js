function perf_end_ms(time0)
{
    const [u, v] = process.hrtime(time0);
    return Math.round((u + v/1E9)*1000);
}

module.exports = perf_end_ms;
