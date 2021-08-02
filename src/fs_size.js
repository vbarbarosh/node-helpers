import fs_fi from './fs_fi';

async function fs_size(file)
{
    return fs_fi(file).then(v => v.size);
}

export default fs_size;
