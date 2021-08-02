import fs_fi from './fs_fi';

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

export default fs_assert_file_readable;
