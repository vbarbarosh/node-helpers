// https://stackoverflow.com/a/39764792/1478566
function math_gcd(a, b)
{
    if (b) {
        return math_gcd(b, a % b);
    }
    return a;
}

module.exports = math_gcd;
