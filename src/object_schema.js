const const_type = require('./const_type');
const gettype = require('./gettype');
const json_stringify_stable = require('./json_stringify_stable');

function object_schema(obj)
{
    const out = {};
    out.type = gettype(obj);
    switch (out.type) {
    case const_type.array:
        out.types = obj.map(object_schema).map(v => json_stringify_stable(v)).sort().filter((v,i,a) => a[i-1] !== v).map(v => JSON.parse(v));
        break;
    case const_type.object:
        out.props = {};
        Object.keys(obj).forEach(function (key) {
            out.props[key] = object_schema(obj[key]);
        });
        break;
    }
    return out;
}

module.exports = object_schema;
