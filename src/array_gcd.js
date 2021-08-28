// https://stackoverflow.com/a/39764792/1478566
function array_gcd(array, fn = Number)
{
    return array.reduce((a,b) => gcd(fn(a), fn(b)));
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
