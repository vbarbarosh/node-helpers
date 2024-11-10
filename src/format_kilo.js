function format_kilo(num)
{
    const sizes = ['', 'K', 'M', 'G', 'T', 'P'];
    if (typeof num !== 'number' || Number.isNaN(num)) {
        return 'n/a';
    }
    if (!num) {
        return '0';
    }
    if (num < 1000) {
        return num.toString();
    }
    const i = parseInt(Math.floor(Math.log(num) / Math.log(1000)), 10);
    return `${(num / (1000 ** i)).toFixed(2)}`.replace(/0$/, '').replace(/\.0$/, '') + sizes[i];
}

module.exports = format_kilo;
