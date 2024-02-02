/**
 * Returns size of a file, or 0 if file is not present. Was created for cases
 * when you need to resume download.
 *
 * @returns {Promise<int>}
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
