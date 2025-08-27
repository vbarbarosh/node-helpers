function _finally(callback)
{
    return {
        [Symbol.dispose]: callback,
    };
}

module.exports = _finally;
