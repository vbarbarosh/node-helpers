import fs_append from './fs_append';
import json_stringify_stable from './json_stringify_stable';

function fs_append_json(file, value)
{
    return fs_append(file, json_stringify_stable(value) + '\n');
}

export default fs_append_json;
