function perf_start()
{
    return process.hrtime();
}

module.exports = perf_start;
