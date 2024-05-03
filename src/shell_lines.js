const shell = require('./shell');

async function shell_lines(args, options)
{
    const s = await shell(args, options);
    return s.trimEnd().split('\n');
}

module.exports = shell_lines;
