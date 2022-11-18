const os = require('os');

function fs_path_tempdir()
{
    return os.tmpdir();
}

module.exports = fs_path_tempdir;
