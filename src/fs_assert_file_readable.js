const fs_fi = require('./fs_fi');

async function fs_assert_file_readable(file)
{
    const fi = await fs_fi(file);
    if (!fi.isFile()) {
        throw new Error(`Not a file: ${file}`);
    }
    if (fi.mode & 0o111) {
        throw new Error(`File is not readable by all: ${file}`);
    }
}

module.exports = fs_assert_file_readable;
