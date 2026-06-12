const math_gcd = require('./math_gcd');

// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array, fn = Number)
{
    return array.map(v => fn(v)).reduce((a,b) => math_gcd(a, b));
}

module.exports = array_gcd;
