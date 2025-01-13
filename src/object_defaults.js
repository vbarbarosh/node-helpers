function object_defaults(obj, defaults)
{
    Object.entries(defaults).forEach(function ([key, value]) {
        if (obj[key] === undefined) {
            obj[key] = value;
        }
    });
    return obj;
}

module.exports = object_defaults;
