// https://stackoverflow.com/a/39764792/1478566
function math_gcd(a, b)
{
    if (b) {
        return math_gcd(b, a % b);
    }
    // GCD is canonically non-negative: without abs, gcd(4,-6) would be -2
    return Math.abs(a);
}

module.exports = math_gcd;
