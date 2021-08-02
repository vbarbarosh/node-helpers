import os from 'os';

function fs_path_tempdir()
{
    return os.tmpdir();
}

export default fs_path_tempdir;
