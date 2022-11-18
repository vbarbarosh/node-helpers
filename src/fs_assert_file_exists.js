const fs_fi = require('./fs_fi');

async function fs_assert_file_exists(file)
{
    const fi = await fs_fi(file);
    if (!fi.isFile()) {
        throw new Error(`Not a file: ${file}`);
    }
}

module.exports = fs_assert_file_exists;
