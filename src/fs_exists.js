import fs from 'fs';

async function fs_exists(path)
{
    return new Promise(function (resolve) {
        fs.access(path, function (error) {
            error ? resolve(false) : resolve(true);
        });
    });
}

export default fs_exists;
