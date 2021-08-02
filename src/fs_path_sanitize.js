import sanitize_filename from 'sanitize-filename';

function fs_path_sanitize(filename)
{
    return sanitize_filename(filename);
}

export default fs_path_sanitize;
