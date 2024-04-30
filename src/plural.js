function plural(n, apple, apples)
{
    return (n % 10 === 1 && n % 100 !== 11) ? apple.split('#').join(n) : apples.split('#').join(n);
}

module.exports = plural;
