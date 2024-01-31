function format_seconds(seconds)
{
    const abs = Math.abs(seconds);
    const hh = Math.floor(abs / 60 / 60);
    const mm = Math.floor(abs / 60) % 60;
    const ss = abs % 60;
    const tmp = `0${hh}:0${mm}:0${ss}`.replace(/0(\d\d)/g, '$1');
    return (seconds < 0) ? ('-' + tmp) : tmp;
}

module.exports = format_seconds;
