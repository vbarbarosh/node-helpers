import fs_fstat from './fs_fstat';

function fs_fsize(fp)
{
    return fs_fstat(fp).then(v => v.size);
}

export default fs_fsize;
