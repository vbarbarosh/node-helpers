function object_walk_preorder(value, fn, path = [])
{
    if (path.length) {
        fn(value, path);
    }
    if (value === null) {
        return;
    }
    if (Array.isArray(value)) {
        for (let i = 0, end = value.length; i < end; ++i) {
            object_walk_preorder(value[i], fn, path.concat('*'));
        }
    }
    else if (typeof value === 'object') {
        const keys = Object.keys(value);
        for (let i = 0, end = keys.length; i < end; ++i) {
            const key = keys[i];
            object_walk_preorder(value[key], fn, path.concat(key));
        }
    }
}

module.exports = object_walk_preorder;
