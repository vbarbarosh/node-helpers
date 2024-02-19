const crypto = require('crypto');
const fs = require('fs');

async function fs_file_md5(file, encoding = 'hex')
{
    const md5 = crypto.createHash('md5');
    const rs = fs.createReadStream(file);
    await rs.forEach(v => md5.update(v));
    return md5.digest(encoding);
}

module.exports = fs_file_md5;
