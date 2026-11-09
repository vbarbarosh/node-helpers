const assert = require('assert');
const fs = require('fs');
const fs_rmrf = require('./fs_rmrf');
const os = require('os');
const path = require('path');

const CALLS = ['lstat', 'readdir', 'unlink', 'rmdir'];

// Every test works inside a temporary directory of its own. The tests of
// refused paths replace the file system calls first, so that a guard that
// stopped working is caught by the stub and never reaches the disk.
describe('fs_rmrf', function () {
    let root = null;
    let restore = [];
    beforeEach(function () {
        root = fs.mkdtempSync(path.join(os.tmpdir(), 'fs_rmrf-test-'));
    });
    afterEach(function () {
        restore.splice(0).forEach(fn => fn());
        fs.rmSync(root, {recursive: true, force: true});
    });

    function wrap(name, fn) {
        const original = fs.promises[name];
        fs.promises[name] = function (...args) {
            return fn(original, args);
        };
        restore.push(() => fs.promises[name] = original);
    }
    function tree(spec, dir = root) {
        for (const [name, value] of Object.entries(spec)) {
            const file = path.join(dir, name);
            if (typeof value === 'string') {
                fs.writeFileSync(file, value);
            }
            else {
                fs.mkdirSync(file);
                tree(value, file);
            }
        }
    }
    function names(dir) {
        return fs.readdirSync(path.join(root, dir)).sort();
    }
    function is_root() {
        return typeof process.getuid === 'function' && process.getuid() === 0;
    }

    it('should remove a file', async function () {
        tree({'a.txt': 'a', 'b.txt': 'b'});
        await fs_rmrf(path.join(root, 'a.txt'));
        assert.deepStrictEqual(names('.'), ['b.txt']);
    });
    it('should remove a tree: nested directories, files, empty directories', async function () {
        tree({t: {'a.txt': 'a', empty: {}, d: {'b.txt': 'b', e: {f: {'c.txt': 'c'}}}}, 'keep.txt': 'k'});
        await fs_rmrf(path.join(root, 't'));
        assert.deepStrictEqual(names('.'), ['keep.txt']);
    });
    it('should resolve for a missing path', async function () {
        await fs_rmrf(path.join(root, 'missing'));
        await fs_rmrf(path.join(root, 'missing', 'deeper'));
    });
    it('should remove a symlink itself and leave its target: a file, a directory, a dangling one', async function () {
        tree({target: {'a.txt': 'a'}, 'file.txt': 'f', t: {}});
        fs.symlinkSync(path.join(root, 'target'), path.join(root, 't', 'to-dir'));
        fs.symlinkSync(path.join(root, 'file.txt'), path.join(root, 't', 'to-file'));
        fs.symlinkSync(path.join(root, 'nowhere'), path.join(root, 't', 'dangling'));
        await fs_rmrf(path.join(root, 't'));
        assert.deepStrictEqual(names('.'), ['file.txt', 'target']);
        assert.deepStrictEqual(names('target'), ['a.txt']);
    });
    it('should remove the link, not what it points to, when the path ends with a slash', async function () {
        tree({precious: {'a.txt': 'a', 'b.txt': 'b'}});
        fs.symlinkSync('precious', path.join(root, 'link'));
        await fs_rmrf(path.join(root, 'link') + path.sep);
        assert.deepStrictEqual(names('.'), ['precious']);
        assert.deepStrictEqual(names('precious'), ['a.txt', 'b.txt']);
    });
    it('should remove a directory given with a trailing slash', async function () {
        tree({t: {'a.txt': 'a'}});
        await fs_rmrf(path.join(root, 't') + path.sep + path.sep);
        assert.deepStrictEqual(names('.'), []);
    });
    it('should delete from the directory it read when the path goes through a link and ..', async function () {
        // <root>/link/../x is <root>/outer/x for the kernel and <root>/x for path.join()
        tree({outer: {inner: {}, x: {'f.txt': 'asked for'}}, x: {'f.txt': 'another directory'}});
        fs.symlinkSync(path.join('outer', 'inner'), path.join(root, 'link'));
        await fs_rmrf([root, 'link', '..', 'x'].join(path.sep));
        assert.deepStrictEqual(names('outer'), ['inner']);
        assert.deepStrictEqual(names('x'), ['f.txt']);
    });
    it('should not descend into a symlink that took the place of a directory after it was examined', async function () {
        tree({t: {sub: {'a.txt': 'inside'}}, outside: {'a.txt': 'outside', 'b.txt': 'outside'}});
        const sub = path.join(root, 't', 'sub');
        let swapped = false;
        wrap('readdir', function (original, args) {
            if (!swapped && String(args[0]) === sub) {
                swapped = true;
                fs.renameSync(sub, path.join(root, 'moved'));
                fs.symlinkSync(path.join(root, 'outside'), sub);
            }
            return original.apply(fs.promises, args);
        });
        await fs_rmrf(path.join(root, 't'));
        assert.ok(swapped);
        assert.deepStrictEqual(names('outside'), ['a.txt', 'b.txt']);
        assert.deepStrictEqual(names('.'), ['moved', 'outside']);
    });
    it('should count an entry that is already gone as removed: two calls at once', async function () {
        const spec = {};
        for (let i = 0; i < 200; ++i) {
            spec[`f${i}`] = '';
        }
        tree({t: spec});
        const results = await Promise.allSettled([fs_rmrf(path.join(root, 't')), fs_rmrf(path.join(root, 't'))]);
        assert.deepStrictEqual(results.map(v => v.reason?.code ?? v.status), ['fulfilled', 'fulfilled']);
        assert.deepStrictEqual(names('.'), []);
    });
    it('should remove a file whose name is not valid UTF-8', async function () {
        tree({t: {'plain.txt': ''}});
        try {
            fs.writeFileSync(Buffer.concat([Buffer.from(path.join(root, 't', 'caf')), Buffer.from([0xe9]), Buffer.from('.txt')]), '');
        }
        catch (error) {
            // a file system that takes only UTF-8 names
            this.skip();
        }
        await fs_rmrf(path.join(root, 't'));
        assert.deepStrictEqual(names('.'), []);
    });
    it('should reject when a path cannot be examined, instead of leaving it silently', async function () {
        if (is_root()) {
            this.skip();
        }
        tree({locked: {'f.txt': ''}});
        fs.chmodSync(path.join(root, 'locked'), 0o000);
        try {
            await assert.rejects(fs_rmrf(path.join(root, 'locked', 'f.txt')), {code: 'EACCES'});
        }
        finally {
            fs.chmodSync(path.join(root, 'locked'), 0o755);
        }
        assert.deepStrictEqual(names('locked'), ['f.txt']);
    });
    it('should remove everything it can and then reject with the first cause', async function () {
        if (is_root()) {
            this.skip();
        }
        tree({t: {'a.txt': '', 'b.txt': '', d: {'c.txt': ''}, readonly: {'stays.txt': ''}}});
        fs.chmodSync(path.join(root, 't', 'readonly'), 0o555);
        try {
            await assert.rejects(fs_rmrf(path.join(root, 't')), {code: 'EACCES'});
        }
        finally {
            fs.chmodSync(path.join(root, 't', 'readonly'), 0o755);
        }
        assert.deepStrictEqual(names('t'), ['readonly']);
        assert.deepStrictEqual(names(path.join('t', 'readonly')), ['stays.txt']);
    });
    it('should keep a bounded number of file system calls in flight', async function () {
        const spec = {};
        for (let i = 0; i < 500; ++i) {
            spec[`f${i}`] = '';
        }
        tree({t: {...spec, d1: {...spec}, d2: {d3: {...spec}}}});
        let now = 0;
        let max = 0;
        CALLS.forEach(function (name) {
            wrap(name, function (original, args) {
                max = Math.max(max, ++now);
                return original.apply(fs.promises, args).finally(() => now--);
            });
        });
        await fs_rmrf(path.join(root, 't'));
        assert.deepStrictEqual(names('.'), []);
        assert.ok(max <= 32, `${max} calls in flight`);
    });
    it('should call progress before each removal, a directory after its entries', async function () {
        tree({t: {'a.txt': '', d: {'b.txt': ''}}});
        const top = path.join(root, 't');
        const calls = [];
        await fs_rmrf(top, (action, file) => calls.push(`${action} ${path.relative(root, file)}`));
        assert.deepStrictEqual([...calls].sort(), ['rm t/a.txt', 'rm t/d/b.txt', 'rmdir t', 'rmdir t/d'].map(v => v.split('/').join(path.sep)).sort());
        assert.ok(calls.indexOf(`rm ${path.join('t', 'd', 'b.txt')}`) < calls.indexOf(`rmdir ${path.join('t', 'd')}`));
        assert.strictEqual(calls.at(-1), 'rmdir t');
    });
    it('should refuse an empty path, a non-string, the root and a path ending in . or .., touching nothing', async function () {
        const touched = [];
        CALLS.forEach(function (name) {
            wrap(name, function (original, args) {
                touched.push(`${name} ${args[0]}`);
                return Promise.reject(Object.assign(new Error('the test keeps the file system out of reach'), {code: 'ENOENT'}));
            });
        });
        const inside = path.join(root, 'x');
        const refused = ['', undefined, null, 42, Buffer.from(inside), path.sep, path.sep + path.sep, '.', '..', `.${path.sep}`, `..${path.sep}`,
            `${inside}${path.sep}.`, `${inside}${path.sep}..`, `${inside}${path.sep}..${path.sep}`, path.parse(root).root];
        for (const value of refused) {
            await assert.rejects(fs_rmrf(value), /^Error: fs_rmrf: /, `fs_rmrf(${JSON.stringify(value)})`);
        }
        assert.deepStrictEqual(touched, []);
    });
});
