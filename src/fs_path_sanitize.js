const sanitize_filename = require('sanitize-filename');

function fs_path_sanitize(filename)
{
    return sanitize_filename(filename);
}

module.exports = fs_path_sanitize;
