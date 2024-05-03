const shell_spawn = require('./shell_spawn');

function shell_thru(args, options)
{
    return shell_spawn(args, {stdio: 'inherit', ...options});
}

module.exports = shell_thru;
