// - update progress by delta
// - update progress by replacing total amount
// - render eta
// - render items/second
// - render percentage
// - time spent
function progress(total)
{
    let done = 0;
    const time0 = Date.now();
    const out = {
        done: 0,
        total,
        eta: null,
        rate: null,
        duration: 0,
        progress: null,
        percentage: null,
        add: function (delta = 0) {
            out.done += delta;
            out.refresh();
        },
        update: function (done) {
            out.done = done;
            out.refresh();
        },
        refresh: function () {
            out.duration = (Date.now() - time0)/1000;
            out.rate = out.done/out.duration;
            out.percentage = !out.total ? null : out.done/out.total;
            out.eta = !out.total ? null : (out.total - out.done)/out.rate;
        },
    };
    return out;
}

module.exports = progress;
