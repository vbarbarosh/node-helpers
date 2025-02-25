const path = require('path');

function fs_path_relative(from, to)
{
    return path.relative(from, to);
}

module.exports = fs_path_relative;
