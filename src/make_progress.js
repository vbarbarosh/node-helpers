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
            history.splice(0, history.findLastIndex(v => v.time < now_minus_10sec) + 1);
            history.push({time: Date.now(), delta});
            out.done += delta;
            out.refresh();
        },
        update: function (done) {
            out.add(done - out.done);
        },
        refresh: function () {
            out.duration = (Date.now() - time0)/1000;
            // `rate` and `eta` are null while unknown (same as before the
            // first add): a zero time window would give rate = Infinity,
            // and a zero rate would give eta = Infinity.
            if (history.length) {
                const delta = history.reduce((a,v) => a + v.delta, 0);
                const time_sec = (Date.now() - history[0].time)/1000;
                out.rate = time_sec ? delta/time_sec : null;
            }
            else {
                out.rate = out.duration ? out.done/out.duration : null;
            }
            out.percents = !out.total ? null : out.done/out.total;
            out.eta = (!out.total || !out.rate) ? null : (out.total - out.done)/out.rate;
        },
    };
    return out;
}

module.exports = make_progress;
