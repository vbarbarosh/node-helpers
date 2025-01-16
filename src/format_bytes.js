/**
 * @link https://stackoverflow.com/a/18650828
 */
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
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / (1024 ** i)).toFixed(bytes > 1024*1024 ? 2 : 0)}${sizes[i]}`.replace(/\.00/, '.0');
}

module.exports = format_bytes;

// https://wiki.ubuntu.com/UnitsPolicy
// > Applications must use SI standard for base-10 units:
// >
// > 1 kB = 1,000 bytes (Note: small k)
// > 1 MB = 1,000 kB = 1,000,000 bytes
// > 1 GB = 1,000 MB = 1,000,000 kB = 1,000,000,000 bytes
// > 1 TB = 1,000 GB = 1,000,000 MB = 1,000,000,000 kB = 1,000,000,000,000 bytes
