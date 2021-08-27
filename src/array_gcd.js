// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array)
{
    return array.reduce(gcd);
}

// https://stackoverflow.com/a/39764792/1478566
function gcd(a, b)
{
    if (b) {
        return gcd(b, a % b);
    }
    return a;
}

export default array_gcd;
