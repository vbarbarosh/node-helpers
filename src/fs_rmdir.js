const fs = require('fs');
const util = require('util');

// https://nodejs.org/api/util.html#util_util_promisify_original
module.exports = util.promisify(fs.rmdir);
