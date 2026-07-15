function parse_bytes(bytes)
{
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (typeof bytes !== 'string') {
        return Number.NaN;
    }
    // Anchored: trailing garbage ('12KB34') is NaN rather than 12KB. A bare
    // number means bytes; whitespace around and between number and unit is ok
    const m = bytes.toUpperCase().match(/^\s*(\d+(?:[.]\d+)?)\s*((?:[KMGTP]I?)?B)?\s*$/);
    if (!m) {
        return Number.NaN;
    }
    return Math.floor(m[1]*Math.pow(1024, sizes.indexOf((m[2] || 'B').replace('I', ''))));
}

module.exports = parse_bytes;
