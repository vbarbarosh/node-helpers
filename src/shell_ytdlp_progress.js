const child_process = require('child_process');
const stream = require('stream');
const stream_each = require('./stream_each');
const stream_ytdlp_progress = require('./stream_ytdlp_progress');

async function shell_ytdlp_progress(args, {progress_fn, ...options})
{
    const proc = child_process.spawn('yt-dlp', ['--progress', ...args], {...options, stdio: 'pipe'});

    const promises = [];
    promises.push(new Promise(function (resolve, reject) {
        proc.once('error', reject);
        proc.once('exit', code => code ? reject(new Error(`Process terminated with code ${code}`)) : resolve());
    }));
    promises.push(stream.promises.pipeline(proc.stdout, stream_ytdlp_progress(), stream_each(progress_fn)));
    promises.push(stream.promises.pipeline(proc.stderr, stream_each(v => console.log(`[stderr] ${v}`))));

    await Promise.all(promises);
}

module.exports = shell_ytdlp_progress;
