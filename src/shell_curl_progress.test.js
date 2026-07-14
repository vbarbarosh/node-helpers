const assert = require('assert');
const shell_curl_progress = require('./shell_curl_progress');

// The appended curl flags (--no-silent, ...) land in $0/$@ of `sh -c`
// and are ignored by the scripts.
describe('shell_curl_progress', function () {
    it('should resolve when the process exits with code 0', async function () {
        await shell_curl_progress(['sh', '-c', 'true'], {user_friendly_status: () => {}});
    });
    it('should reject when the process exits with a non zero code', async function () {
        await assert.rejects(
            shell_curl_progress(['sh', '-c', 'exit 3'], {user_friendly_status: () => {}}),
            /code 3/);
    });
    it('should reject when the process is killed by a signal', async function () {
        await assert.rejects(
            shell_curl_progress(['sh', '-c', 'kill -9 $$'], {user_friendly_status: () => {}}),
            /signal SIGKILL/);
    });
});
