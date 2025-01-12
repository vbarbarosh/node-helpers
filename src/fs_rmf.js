const fs_rm = require('./fs_rm');

/**
 * Remove the file if it exists.
 */
async function fs_rmf(path)
{
    try {
        await fs_rm(path);
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

module.exports = fs_rmf;
