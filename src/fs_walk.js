const fs_lstat = require('./fs_lstat');
const fs_path_join = require('./fs_path_join');
const fs_readdir = require('./fs_readdir');
const ignore = require('./ignore');

async function fs_walk({path = '.', user_friendly_status = ignore, error_handler = error_handler, signal})
{
    const out = [];
    const queue = [path];
    while (queue.length) {
        if (signal) {
            signal.throwIfAborted();
        }
        try {
            const current_path = queue.pop();
            user_friendly_status(`Reading ${current_path}`);
            const lstat = await fs_lstat(current_path);
            lstat.path = current_path;
            out.push(lstat);
            if (lstat.isDirectory()) {
                if (current_path === '/dev' || current_path === '/proc') {
                    continue;
                }
                const basenames = await fs_readdir(current_path);
                basenames.forEach(v => queue.push(fs_path_join(current_path, v)));
            }
        }
        catch (error) {
            error_handler(error);
        }
    }
    return out;
}

function error_handler(error)
{
    console.log(`⚠️ ${error.message}`);
}

module.exports = fs_walk;
