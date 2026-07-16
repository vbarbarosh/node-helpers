const ssh2 = require('ssh2');

const {STATUS_CODE} = ssh2.utils.sftp;

const FILE = '/data.bin';
const HOST_KEYS = [ssh2.utils.generateKeyPairSync('ed25519').private];

/**
 * In-process sftp server for tests: serves a single virtual file `/data.bin`
 * with the given body; login is user1/pass1.
 *
 * const server = await sftp_server_listen(body);
 * server.url('/data.bin')  // sftp://user1:pass1@127.0.0.1:PORT/data.bin
 * server.closed()          // number of fully closed ssh connections
 * await server.close();
 */
async function sftp_server_listen(body)
{
    let closed = 0;
    const server = new ssh2.Server({hostKeys: HOST_KEYS}, function (client) {
        client.on('error', function () {/* client gone mid-handshake */});
        client.on('close', function () {
            closed++;
        });
        client.on('authentication', function (ctx) {
            if (ctx.method === 'password' && ctx.username === 'user1' && ctx.password === 'pass1') {
                ctx.accept();
            }
            else {
                ctx.reject(['password']);
            }
        });
        client.on('ready', function () {
            client.on('session', function (accept) {
                accept().on('sftp', function (accept) {
                    serve_sftp(accept(), body);
                });
            });
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    return {
        url: pathname => `sftp://user1:pass1@127.0.0.1:${server.address().port}${pathname}`,
        closed: () => closed,
        close: () => new Promise(resolve => server.close(resolve)),
    };
}

function serve_sftp(sftp, body)
{
    const dir_attrs = {mode: 0o40755, uid: 0, gid: 0, size: 0, atime: 0, mtime: 0};
    const file_attrs = {mode: 0o100644, uid: 0, gid: 0, size: body.length, atime: 0, mtime: 0};
    const handles = new Map();
    let next_handle = 0;

    sftp.on('OPEN', function (reqid, filename) {
        if (filename !== FILE) {
            sftp.status(reqid, STATUS_CODE.NO_SUCH_FILE);
            return;
        }
        sftp.handle(reqid, make_handle({type: 'file'}));
    });
    sftp.on('READ', function (reqid, handle, offset, length) {
        if (offset >= body.length) {
            sftp.status(reqid, STATUS_CODE.EOF);
            return;
        }
        sftp.data(reqid, body.subarray(offset, offset + length));
    });
    sftp.on('FSTAT', function (reqid) {
        sftp.attrs(reqid, file_attrs);
    });
    sftp.on('STAT', stat);
    sftp.on('LSTAT', stat);
    sftp.on('OPENDIR', function (reqid, pathname) {
        if (pathname !== '/') {
            sftp.status(reqid, STATUS_CODE.NO_SUCH_FILE);
            return;
        }
        sftp.handle(reqid, make_handle({type: 'dir', listed: false}));
    });
    sftp.on('READDIR', function (reqid, handle) {
        const state = handles.get(handle.toString('hex'));
        if (!state || state.type !== 'dir') {
            sftp.status(reqid, STATUS_CODE.FAILURE);
            return;
        }
        if (state.listed) {
            sftp.status(reqid, STATUS_CODE.EOF);
            return;
        }
        state.listed = true;
        sftp.name(reqid, [{filename: 'data.bin', longname: '-rw-r--r-- 1 root root 0 Jan 1 1970 data.bin', attrs: file_attrs}]);
    });
    sftp.on('CLOSE', function (reqid, handle) {
        handles.delete(handle.toString('hex'));
        sftp.status(reqid, STATUS_CODE.OK);
    });

    function stat(reqid, pathname) {
        switch (pathname) {
        case '/':
            sftp.attrs(reqid, dir_attrs);
            break;
        case FILE:
            sftp.attrs(reqid, file_attrs);
            break;
        default:
            sftp.status(reqid, STATUS_CODE.NO_SUCH_FILE);
            break;
        }
    }

    function make_handle(state) {
        const handle = Buffer.alloc(4);
        handle.writeUInt32BE(next_handle++);
        handles.set(handle.toString('hex'), state);
        return handle;
    }
}

module.exports = sftp_server_listen;
