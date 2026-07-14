const math_gcd = require('./math_gcd');

// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array, fn = Number)
{
    // 0 is the identity of gcd (gcd(0, x) = x); it also makes an empty
    // array return 0 instead of throwing
    return array.map(v => fn(v)).reduce((a,b) => math_gcd(a, b), 0);
}

module.exports = array_gcd;
