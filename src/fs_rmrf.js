const fs = require('fs');
const ignore = require('./ignore');
const pathlib = require('path');

// File system calls one fs_rmrf() keeps in flight
const CONCURRENCY = 32;
// How many times a directory is examined again after it changed under the call
const RETRIES = 3;

const SEPARATOR = Buffer.from(pathlib.sep);
const SEPARATORS = (pathlib.sep === '\\') ? /[\\/]+/ : /\/+/;
const TRAILING_SEPARATORS = (pathlib.sep === '\\') ? /[\\/]+$/ : /\/+$/;

/**
 * Remove a file or directory, along with all nested files and directories, recursively.
 */
async function fs_rmrf(path, progress = ignore)
{
    if (typeof path !== 'string' || path === '') {
        throw new Error('fs_rmrf: path should be a non-empty string');
    }
    // With a trailing separator the kernel follows a symlink: "link/" is the
    // directory it points to, and its entries would be removed instead of it
    const top = path.replace(TRAILING_SEPARATORS, '');
    const last = top.split(SEPARATORS).pop();
    const resolved = pathlib.resolve(path);
    if (top === '' || last === '.' || last === '..' || resolved === pathlib.parse(resolved).root) {
        throw new Error(`fs_rmrf: refusing to remove ${JSON.stringify(path)}`);
    }
    await remove(Buffer.from(top), progress, limiter(CONCURRENCY), RETRIES);
}

// Paths are buffers: an entry's name is appended byte for byte, so a name that
// is not valid UTF-8 stays the name of the same file, and the kernel resolves
// an entry by the same route as the directory it was read from.
async function remove(path, progress, limit, retries)
{
    const stat = await limit(() => fs.promises.lstat(path)).catch(missing);
    if (stat === null) {
        return;
    }
    if (!stat.isDirectory()) {
        progress('rm', path.toString());
        await limit(() => fs.promises.unlink(path)).catch(missing);
        return;
    }

    // Between the lstat and the readdir the directory may have been replaced,
    // by a symlink for one: the names read would then be those of another
    // directory. Node has no openat(), so the directory is examined again and
    // nothing is touched unless it is still the same one. This narrows the
    // window; it cannot close it.
    let names = null;
    let again = null;
    try {
        names = await limit(() => fs.promises.readdir(path, {encoding: 'buffer'}));
        again = await limit(() => fs.promises.lstat(path));
    }
    catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') {
            throw error;
        }
    }
    if (again === null || again.dev !== stat.dev || again.ino !== stat.ino) {
        if (retries === 0) {
            throw new Error(`fs_rmrf: ${path} keeps changing while it is being removed`);
        }
        return remove(path, progress, limit, retries - 1);
    }

    // Every entry is tried; the first failure is reported once all have settled
    const errors = [];
    await Promise.all(names.map(function (name) {
        return remove(Buffer.concat([path, SEPARATOR, name]), progress, limit, RETRIES).catch(error => errors.push(error));
    }));
    if (errors.length) {
        throw errors[0];
    }
    progress('rmdir', path.toString());
    await limit(() => fs.promises.rmdir(path)).catch(missing);
}

// An entry that is already gone is a removed one
function missing(error)
{
    if (error.code === 'ENOENT') {
        return null;
    }
    throw error;
}

function limiter(max)
{
    const queue = [];
    let active = 0;
    return function (fn) {
        return new Promise(function (resolve, reject) {
            queue.push(function () {
                active++;
                fn().then(resolve, reject).finally(function () {
                    active--;
                    next();
                });
            });
            next();
        });
    };
    function next() {
        if (active < max && queue.length) {
            queue.shift()();
        }
    }
}

module.exports = fs_rmrf;
