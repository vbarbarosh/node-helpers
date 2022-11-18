const fs_append = require('./fs_append');
const json_stringify_stable = require('./json_stringify_stable');

function fs_append_json(file, value)
{
    return fs_append(file, json_stringify_stable(value) + '\n');
}

module.exports = fs_append_json;
