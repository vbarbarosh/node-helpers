import path from 'path';

function fs_path_resolve(...parts)
{
    return path.resolve(...parts);
}

export default fs_path_resolve;
