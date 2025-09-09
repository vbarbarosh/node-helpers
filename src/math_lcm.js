const math_gcd = require('./math_gcd');

function math_lcm(a, b)
{
    return Math.abs(a*b) / math_gcd(a, b);
}

module.exports = math_lcm;
