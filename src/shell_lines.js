const shell = require('./shell');

async function shell_lines(args, options)
{
    const s = (await shell(args, options)).trimEnd();
    return s === '' ? [] : s.split('\n');
}

module.exports = shell_lines;
