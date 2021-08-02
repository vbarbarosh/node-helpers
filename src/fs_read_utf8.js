import fs_read from './fs_read';

async function fs_read_utf8(file)
{
    return await fs_read(file, {encoding: 'utf8'});
}

export default fs_read_utf8;
