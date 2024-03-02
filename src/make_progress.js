// - update progress by delta
// - update progress by replacing total amount
// - render eta
// - render items/second
// - render percents
// - time spent
//
// https://bramcohen.livejournal.com/24122.html
function make_progress(total)
{
    const history = [];
    const time0 = Date.now();
    const out = {
        done: 0,
        total,
        eta: null,
        // `rate` instead of `bps` (bytes per speed) because this function could count any values (e.g.
        // copied bytes over time, or handled jobs over time, or created object over time, etc.)
        rate: null,
        duration: 0,
        progress: null,
        percents: null,
        add: function (delta = 0) {
            const now_minus_10sec = Date.now() - 10000;
            history.splice(0, history.findLastIndex(v => v.time < now_minus_10sec));
            history.push({time: Date.now(), delta});
            out.done += delta;
            out.refresh();
        },
        update: function (done) {
            out.add(done - out.done);
        },
        refresh: function () {
            out.duration = (Date.now() - time0)/1000;
            out.percents = !out.total ? null : out.done/out.total;
            out.eta = !out.total ? null : (out.total - out.done)/out.rate;
            if (history.length) {
                const delta = history.reduce((a,v) => a + v.delta, 0);
                const time_sec = (Date.now() - history[0].time)/1000;
                out.rate = delta/time_sec;
            }
            else {
                out.rate = out.done/out.duration;
            }
        },
    };
    return out;
}

module.exports = make_progress;
