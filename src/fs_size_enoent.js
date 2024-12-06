const fs = require('fs');

/**
 * Returns the size of a file, or 0 if the file is not present.
 * It was created for cases when you need to resume a download.
 */
async function fs_size_enoent(path)
{
    try {
        const stat = await fs.promises.stat(path);
        return stat.size;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return 0;
        }
        throw error;
    }
}

module.exports = fs_size_enoent;
