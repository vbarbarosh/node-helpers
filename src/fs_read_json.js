import fs_read from './fs_read';

// XXX Should support catchReturn, e.g.
//     fs_read_json(file).catchReturn(default_value)
function fs_read_json(file)
{
    return fs_read(file, {encoding: 'utf8'}).then(JSON.parse);
}

export default fs_read_json;
