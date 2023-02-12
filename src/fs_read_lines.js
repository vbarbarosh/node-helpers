const fs_read = require('./fs_read');

// XXX Should support catchReturn, e.g.
//     fs_read_lines(file).catchReturn(default_value)
function fs_read_lines(file)
{
    return fs_read(file, {encoding: 'utf8'}).then(v => v.split('\n'));
}

module.exports = fs_read_lines;
