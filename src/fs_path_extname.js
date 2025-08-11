const path = require('path');

function fs_path_extname(p)
{
    return path.extname(p);
}

// function extname(s)
// {
//     const i = s.lastIndexOf('.');
//     return (i > 0) ? s.slice(i) : null;
// }

module.exports = fs_path_extname;
