const fs = require('fs');
const fs_path_resolve = require('./fs_path_resolve');
const fs_path_tempdir = require('./fs_path_tempdir');
const fs_rmrf = require('./fs_rmrf');
const util = require('util');

// https://nodejs.org/api/util.html#util_util_promisify_original
const mkdtemp = util.promisify(fs.mkdtemp);

// * https://www.cons.org/cracauer/sigint.html from https://stackoverflow.com/q/14031763/1478566
// * http://www.tldp.org/LDP/abs/html/exitcodes.html from https://stackoverflow.com/q/14031763/1478566
// * https://www.exratione.com/2013/05/die-child-process-die/

async function fs_tempdir(fn)
{
    process.on('SIGINT', sigint);

    let d = null, out;
    try {
        d = await mkdtemp(fs_path_resolve(fs_path_tempdir(), 'vbtemp'));
        out = await fn(d);
    }
    finally {
        await clean();
    }
    return out;

    async function clean() {
        process.removeListener('SIGINT', sigint);
        if (d) {
            await fs_rmrf(d);
        }
    }

    async function sigint() {
        await clean().catch(function () {/* ignore */});
        // https://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits#comment68567869_21947851
        process.kill(process.pid, 'SIGINT');
    }
}

module.exports = fs_tempdir;
