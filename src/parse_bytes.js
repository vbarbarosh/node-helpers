function parse_bytes(bytes)
{
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (typeof bytes !== 'string') {
        return Number.NaN;
    }
    const m = bytes.toUpperCase().match(/(\d+([.]?\d+)?)(([KMGTP]I?)?B)/);
    if (!m) {
        return Number.NaN;
    }
    return Math.floor(m[1]*Math.pow(1024, sizes.indexOf(m[3].replace('I', ''))));
}

module.exports = parse_bytes;
