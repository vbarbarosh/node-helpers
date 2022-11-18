const path = require('path');

function fs_path_join(...parts)
{
    return path.join(...parts);
}

module.exports = fs_path_join;
