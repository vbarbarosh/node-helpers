const fs_fopen = require('./fs_fopen');

/**
 * The main use case is uploading files in chunks.
 * Each time a chunk is uploaded, update the target file.
 * By the end, you will have a ready-to-use file.
 */
async function fs_fopen_update(pathname)
{
    try {
        // Open a file for updating...
        return await fs_fopen(pathname, 'r+');
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }

    try {
        // There is no such file; try to create it...
        return await fs_fopen(pathname, 'wx');
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }

    // Another process might have already created it; try opening it for updating
    return fs_fopen(pathname, 'r+');
}

module.exports = fs_fopen_update;
