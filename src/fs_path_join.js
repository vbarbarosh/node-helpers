import path from 'path';

function fs_path_join(...parts)
{
    return path.join(...parts);
}

export default fs_path_join;
