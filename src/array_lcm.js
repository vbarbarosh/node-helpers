const math_lcm = require('./math_lcm');

// https://stackoverflow.com/a/39764792/1478566
function array_lcm(array, fn = Number)
{
    return array.reduce((a,b) => math_lcm(fn(a), fn(b)));
}

module.exports = array_lcm;
