const const_type = require('./const_type');
const gettype = require('./gettype');
const json_stringify_stable = require('./json_stringify_stable');

function object_schema(obj)
{
    const type = gettype(obj);
    switch (type) {
    case const_type.array:
        return obj.map(object_schema).map(v => json_stringify_stable(v)).sort().filter((v,i,a) => a[i-1] !== v).map(v => JSON.parse(v));
    case const_type.object:
        const out = {};
        Object.keys(obj).forEach(function (key) {
            out[key] = object_schema(obj[key]);
        });
        return out;
    default:
        return type;
    }
}

module.exports = object_schema;
