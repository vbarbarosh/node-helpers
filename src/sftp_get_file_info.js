const Promise = require('bluebird');
const ignore = require('./ignore');
const ssh2 = require('ssh2');
const waitcb = require('./waitcb');

async function sftp_get_file_info(url, {user_friendly_status = ignore})
{
    const u = new URL(url);
    const host = u.host;
    const port = +u.port || 22;
    const username = decodeURIComponent(u.username);
    const password = decodeURIComponent(u.password);
    const pathname = u.pathname;

    user_friendly_status('Establishing connection...');
    const conn = new ssh2.Client();
    try {
        await new Promise(function (resolve, reject) {
            conn.once('ready', resolve);
            conn.once('error', reject);
            conn.connect({host, port, username, password});
        });

        user_friendly_status('Asking for an sftp service...');
        const sftp = await waitcb(cb => conn.sftp(cb));

        user_friendly_status('Requesting file info...');
        const [stat, lstat, readdir] = await Promise.all([
            waitcb(cb => sftp.stat(pathname, cb)),
            waitcb(cb => sftp.lstat(pathname, cb)),
            waitcb(cb => sftp.readdir(pathname, cb)),
        ]);
        return {
            stat,
            lstat,
            readdir,
        };
    }
    finally {
        conn.end();
    }
}

module.exports = sftp_get_file_info;
