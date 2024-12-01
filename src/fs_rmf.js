const fs_exists = require('./fs_exists');
const fs_rm = require('./fs_rm');

/**
 * Remove the file if it exists.
 */
async function fs_rmf(filename)
{
    if (await fs_exists(filename)) {
        await fs_rm(filename);
    }
}

module.exports = fs_rmf;
