function _perf(name, print = s => console.log(s))
{
    const time0 = performance.now();
    return {
        times: 1,
        [Symbol.dispose]: function () {
            const duration = performance.now() - time0;
            if (this.times > 1) {
                print(`[${name}] ${duration.toFixed(4)}ms x ${this.times}`);
            }
            else {
                print(`[${name}] ${duration.toFixed(4)}ms`);
            }
        },
    };
}

module.exports = _perf;
