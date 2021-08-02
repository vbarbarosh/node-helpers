import fs from 'fs';
import fs_path_resolve from './fs_path_resolve';
import fs_path_tempdir from './fs_path_tempdir';
import fs_rmrf from './fs_rmrf';
import util from 'util';

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

export default fs_tempdir;
