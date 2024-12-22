const escape_content_disposition = require('./escape_content_disposition');
const fs_fclose = require('./fs_fclose');
const fs_fopen = require('./fs_fopen');
const fs_fread = require('./fs_fread');
const fs_path_basename = require('./fs_path_basename');
const fs_size = require('./fs_size');
const http_range_parse = require('./http_range_parse');
const mime_types = require('mime-types');

// https://stackoverflow.com/questions/63649387/get-vs-head-methods-in-express-example#comment120040338_63649698
// > Note: the app.get() function is automatically called for the HTTP HEAD
// > method in addition to the GET method if app.head() was not called for the
// > path before app.get().
//
// https://expressjs.com/en/api.html#router.METHOD
// > The router.get() function is automatically called for the HTTP HEAD method
// > in addition to the GET method if router.head() was not called for the path
// > before router.get().
//
// https://www.npmjs.com/package/send

async function http_stream_range(req, res, file)
{
    // req.log(`[http_stream_range_begin] ${JSON.stringify(req.headers)}`);

    const total = await fs_size(file);
    const mime = mime_types.lookup(file);

    if (req.method === 'HEAD') {
        res.header('Content-Type', mime);
        res.header('Content-Length', total);
        res.header('Content-Disposition', `inline; filename=${escape_content_disposition(fs_path_basename(file))};`);
        res.status(200);
        res.end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }

    const fp = await fs_fopen(file);
    const buf = Buffer.alloc(2*1024*1024);

    try {
        let req_close = false;
        req.once('close', () => req_close = true);

        let first, last;

        // bytes=0-
        // bytes=-100
        if (req.headers.range) {
            const range = http_range_parse(req.headers.range, total);
            first = range.first;
            last = range.last;
            // req.log(`[http_stream_range_range] ${JSON.stringify({range: req.headers.range, first, last, total, orig: req.headers.range})}`);
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range
            res.status(206);
            res.header('Content-Type', mime);
            res.header('Content-Range', `bytes ${first}-${last}/${total}`);
            res.header('Content-Length', last - first + 1);
        }
        else {
            first = 0;
            last = total - 1;
            res.header('Content-Type', mime);
            res.header('Content-Length', last - first + 1);
        }

        let total_read = 0;
        for (let offset = first; offset <= last && !req_close; ) {
            const chunk = await fs_fread(fp, buf, offset, Math.min(buf.length, last - offset + 1));
            offset += chunk.length;
            total_read += chunk.length;
            if (res.write(chunk)) {
                // req.log(`[http_stream_range_write] ${chunk.length}`);
                continue;
            }
            await new Promise(function (resolve) {
                res.on('drain', drain);
                res.on('close', close);
                function drain() {
                    // req.log('[http_stream_range_drain]');
                    res.off('drain', drain);
                    res.off('close', close);
                    resolve();
                }
                function close() {
                    // req.log('[http_stream_range_close]');
                    res.off('drain', drain);
                    res.off('close', close);
                    resolve();
                }
            });
        }

        // req.log(`[http_stream_range_end_ok] ${JSON.stringify({req_close, total_read})}`);
        res.end();
    }
    finally {
        await fs_fclose(fp);
    }
}

module.exports = http_stream_range;
