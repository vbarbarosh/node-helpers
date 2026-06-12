const math_lcm = require('./math_lcm');

function array_lcm(array, fn = Number)
{
    return array.map(v => fn(v)).reduce((a,b) => math_lcm(a, b));
}

module.exports = array_lcm;
