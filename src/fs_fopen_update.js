import fs_fopen from './fs_fopen';

// Main use case is uploading files in chunks. Each time
// a chunk is uploaded do update a target file. At the end
// you will have a ready to go file.

async function fs_fopen_update(pathname)
{
    try {
        // Open a file for updating...
        return await fs_fopen(pathname, 'r+');
    }
    catch (error) {
        if (error.code != 'ENOENT') {
            throw error;
        }
    }

    try {
        // There is no such a file, try to create it...
        return await fs_fopen(pathname, 'wx');
    }
    catch (error) {
        if (error.code != 'EEXIST') {
            throw error;
        }
    }

    // Another process might have already created it, try to
    // open for updating...
    return fs_fopen(pathname, 'r+');
}

export default fs_fopen_update;
