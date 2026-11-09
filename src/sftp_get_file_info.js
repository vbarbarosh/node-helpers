const Promise = require('bluebird');
const ignore = require('./ignore');
const sftp_connect = require('./sftp_connect');
const waitcb = require('./waitcb');

async function sftp_get_file_info(url, {user_friendly_status = ignore, fingerprint} = {})
{
    const pathname = new URL(url).pathname;

    user_friendly_status('Establishing connection...');
    const conn = await sftp_connect(url, {fingerprint});
    try {
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
