import fs_fi from './fs_fi';

async function fs_assert_file_exists(file)
{
    const fi = await fs_fi(file);
    if (!fi.isFile()) {
        throw new Error(`Not a file: ${file}`);
    }
}

export default fs_assert_file_exists;
