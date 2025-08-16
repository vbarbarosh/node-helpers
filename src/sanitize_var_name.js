const sanitize_dash_name = require('./sanitize_dash_name');
const str_camel_to_snake = require('./str_camel_to_snake');

function sanitize_var_name(var_name)
{
    const out = sanitize_dash_name(str_camel_to_snake(var_name)).replace(/[^a-z0-9]+/g, '_');
    if (out.length === 0) {
        return '_';
    }
    if (out[0].match(/[0-9]/)) {
        return '_' + out;
    }
    return out;
}

module.exports = sanitize_var_name;
