const os = require('os');
const homedir = os.homedir();

/**
 * @link https://github.com/sindresorhus/untildify/blob/a901e25ef782d93df1eba04ed48f56c79d157c74/index.js
 */
function fs_path_untildify(path)
{
    return homedir ? path.replace(/^~(?=$|\/|\\)/, homedir) : path;
}

module.exports = fs_path_untildify;
