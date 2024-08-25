const child_process = require('child_process');
const format_seconds = require('./format_seconds');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_ytdlp_progress = require('./stream_ytdlp_progress');

async function shell_ytdlp_progress(args, {user_friendly_status, ...options})
{
    const proc = child_process.spawn('yt-dlp', ['--progress', ...args], {...options, stdio: 'pipe'});
    const time0 = Date.now();

    const promises = [];
    promises.push(new Promise(function (resolve, reject) {
        proc.once('error', reject);
        proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
    }));
    promises.push(stream.promises.pipeline(proc.stdout, stream_ytdlp_progress(), stream_each(progress_fn)));
    promises.push(stream.promises.pipeline(proc.stderr, stream_each(v => console.log(`[stderr] ${v}`))));

    await Promise.all(promises);

    function progress_fn(v) {
        const duration = format_seconds((Date.now() - time0)/1000);
        if (v.merging) {
            user_friendly_status(`Merging... duration=${duration}`);
        }
        else {
            user_friendly_status(`${v.perc} | [${v.current_part}/${v.total_parts}] ${v.done} of ${v.total} at ${v.speed} ETA ${v.eta} duration=${duration}`);
        }
    }
}

module.exports = shell_ytdlp_progress;
