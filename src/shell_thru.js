const shell = require('./shell');

function shell_thru(args, options)
{
    return shell(args, {stdio: 'inherit', ...options});
}

module.exports = shell_thru;
