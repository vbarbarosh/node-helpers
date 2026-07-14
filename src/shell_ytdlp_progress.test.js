const assert = require('assert');
const fs_path_resolve = require('./fs_path_resolve');
const fs_tempdir = require('./fs_tempdir');
const fs_write = require('./fs_write');
const shell_ytdlp_progress = require('./shell_ytdlp_progress');

// shell_ytdlp_progress hardcodes the `yt-dlp` binary: the tests plant a
// fake executable and prepend its directory to PATH.
function with_fake_ytdlp(script, fn)
{
    return fs_tempdir(async function (d) {
        await fs_write(fs_path_resolve(d, 'yt-dlp'), `#!/bin/sh\n${script}\n`, {mode: 0o755});
        await fn({env: {...process.env, PATH: `${d}:${process.env.PATH}`}});
    });
}

describe('shell_ytdlp_progress', function () {
    it('should resolve when the process exits with code 0', async function () {
        await with_fake_ytdlp('true', async function (options) {
            await shell_ytdlp_progress([], {user_friendly_status: () => {}, ...options});
        });
    });
    it('should reject when the process exits with a non zero code', async function () {
        await with_fake_ytdlp('exit 3', async function (options) {
            await assert.rejects(
                shell_ytdlp_progress([], {user_friendly_status: () => {}, ...options}),
                /code 3/);
        });
    });
    it('should reject when the process is killed by a signal', async function () {
        await with_fake_ytdlp('kill -9 $$', async function (options) {
            await assert.rejects(
                shell_ytdlp_progress([], {user_friendly_status: () => {}, ...options}),
                /signal SIGKILL/);
        });
    });
});
