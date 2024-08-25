function format_bytes(bytes)
{
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (typeof bytes !== 'number' || Number.isNaN(bytes)) {
        return 'n/a';
    }
    if (!bytes) {
        return '0KB';
    }
    if (bytes < 1024) {
        return '1KB';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / (1024 ** i)).toFixed(bytes > 1024*1024 ? 2 : 0)}${sizes[i]}`.replace(/\.00/, '.0');
}

module.exports = format_bytes;
