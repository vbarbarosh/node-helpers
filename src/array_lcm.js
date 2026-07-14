const math_lcm = require('./math_lcm');

function array_lcm(array, read = Number)
{
    // 1 is the identity of lcm (lcm(1, x) = x); it also makes an empty
    // array return 1 instead of throwing
    return array.map(v => read(v)).reduce((a,b) => math_lcm(a, b), 1);
}

module.exports = array_lcm;
