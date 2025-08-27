function _try(callback, default_value)
{
    try {
        return callback();
    }
    catch {
        return default_value;
    }
}

module.exports = _try;
