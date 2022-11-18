const path = require('path');

function fs_path_resolve(...parts)
{
    return path.resolve(...parts);
}

module.exports = fs_path_resolve;
