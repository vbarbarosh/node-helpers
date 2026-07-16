Thin wrapper over `fs.promises.writeFile(file, data, options)`.
Creates or truncates the file; `data` may be a string (written as UTF-8 unless `options` says otherwise), a `Buffer`, or a `TypedArray`.
For objects, prefer `fs_write_json`.
