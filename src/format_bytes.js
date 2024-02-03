function format_bytes(bytes)
{
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    if (Number.isNaN(bytes*1)) {
        return 'n/a';
    }
    if (bytes == 0) {
        return '0KB';
    }
    if (bytes < 1024) {
        return '1KB';
    }
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return `${(bytes / (1024 ** i)).toFixed(bytes > 1024*1024 ? 1 : 0)}${sizes[i]}`;
}

module.exports = format_bytes;
