const lib = require('sanitize-filename');

function sanitize_filename(filename)
{
    return lib(filename);
}

module.exports = sanitize_filename;
