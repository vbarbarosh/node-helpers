// 1) Capture original value
// 2) Assign a temporary one
// 3) Automatically restore on scope exit
//
// Basically: set variable, and automatically restore the original value at the end of scope.
function _restore(value, callback)
{
    const [original] = callback(value);
    return {
        [Symbol.dispose]: function () {
            callback(original);
        },
    };
}

module.exports = _restore;
