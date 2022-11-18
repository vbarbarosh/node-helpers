const fs_read = require('./fs_read');

// XXX Should support catchReturn, e.g.
//     fs_read_json(file).catchReturn(default_value)
function fs_read_json(file)
{
    return fs_read(file, {encoding: 'utf8'}).then(JSON.parse);
}

module.exports = fs_read_json;
