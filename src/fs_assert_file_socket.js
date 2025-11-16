const fs_fi = require('./fs_fi');

async function fs_assert_file_socket(file)
{
    const fi = await fs_fi(file);
    if (!fi.isSocket()) {
        throw new Error(`Not a socket: ${file}`);
    }
}

module.exports = fs_assert_file_socket;
