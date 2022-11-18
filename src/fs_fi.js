const fs_lstat = require('./fs_lstat');
const fs_path_basename = require('./fs_path_basename');
const fs_path_dirname = require('./fs_path_dirname');
const fs_path_resolve = require('./fs_path_resolve');
const fs_readlink = require('./fs_readlink');

async function fs_fi(pathname)
{
    const basename = fs_path_basename(pathname);
    const fi = await fs_lstat(pathname);
    fi.pathname = pathname;
    fi.basename = basename;
    flags(fi);
    if (fi.isSymbolicLink()) {
        const target = await fs_readlink(fi.pathname);
        const target_pathname = fs_path_resolve(fs_path_dirname(pathname), target);
        fi.target = target;
        fi.target_fi = await fs_lstat(target_pathname);
        fi.target_fi.pathname = target_pathname;
        fi.target_fi.basename = fs_path_basename(target_pathname);
        flags(fi.target_fi);
    }
    return fi;
}

function flags(fi)
{
    const tmp = [];
    if (fi.isFile()) {
        tmp.push('is_file');
    }
    if (fi.isDirectory()) {
        tmp.push('is_directory');
    }
    if (fi.isBlockDevice()) {
        tmp.push('is_block_device');
    }
    if (fi.isCharacterDevice()) {
        tmp.push('is_character_device');
    }
    if (fi.isSymbolicLink()) {
        tmp.push('is_symbolic_link');
    }
    if (fi.isFIFO()) {
        tmp.push('is_fifo');
    }
    if (fi.isSocket()) {
        tmp.push('is_socket');
    }
    fi.flags = tmp;
    fi.flags_map = {};
    tmp.forEach(key => fi.flags_map[key] = true);
}

module.exports = fs_fi;
