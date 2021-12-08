// noinspection EqualityComparisonWithCoercionJS

import array_sum from '../../src/array_sum';
import cli from '../../src/cli';
import fs_read_stream from '../../src/fs_read_stream';
import fs_size from '../../src/fs_size';
import fs_write_stream from '../../src/fs_write_stream';
import http from 'http';
import https from 'https';

const HTTPX_BREAK = 'HTTPX_BREAK';
const HTTPX_DESTROY = 'HTTPX_DESTROY';

cli(main);

async function main()
{
    // const json = await http_get_json('https://randomuser.me/api/');
    // console.log(json);
    // return;

    // const image = await http_get_buffer('https://httpbin.org/image/jpeg');
    // console.log(image);
    // await http_get_file('https://httpbin.org/image/jpeg', 'a.jpg');
    // const text = await http_post_json('https://echo.vbarbarosh.com', {a:1,b:2});
    // const text = await axios.post('https://echo.vbarbarosh.com', 'xxx', {responseType: 'json'}).then(v => v.data);
    // console.log(text);

    if(0)await httpx({
        url: 'https://mirrors.mivocloud.com/ubuntu-releases/20.04.3/ubuntu-20.04.3-desktop-amd64.iso',
        method: 'GET',
        mixins: [
            httpx_request_as_void(),
            httpx_response_as_file('ubuntu20.iso'),
            httpx_request_progress(function (delta, ready, total) {
                console.log('http_request_progress', delta, ready, total);
            }),
            httpx_response_progress(function (delta, ready, total) {
                console.log('http_response_progress', delta, ready, total, (ready/total*100).toFixed(2) + '%');
            }),
        ],
    });

    const a = await httpx({
        //url: 'https://httpbin.org/redirect-to?url=' + encodeURIComponent('https://randomuser.me/api/'),
        // url: 'http://localhost:3000/redirect?url=https%3A%2F%2Frandomuser.me%2Fapi%2F',
        url: 'http://127.0.0.1:3000/redirect?url=http://127.0.0.1:3000/redirect?url=http://127.0.0.1:3000/redirect?url=http://127.0.0.1:3000/redirect?url=https://randomuser.me/api/',
        mixins: [
            httpx_follow_redirects(),
            httpx_retry(),
            httpx_request_as_void(),
            httpx_response_as_json(),
        ]
    });
    console.log(a);
    return;

    await httpx({
        url: 'https://httpbin.org/status/400',
        method: 'GET',
        mixins: [
            httpx_follow_redirects(),
            httpx_request_as_void(),
            httpx_response_ignore(),
        ]
    });

    await httpx({
        url: 'https://httpbin.org/image/jpeg',
        method: 'GET',
        mixins: [
            httpx_request_as_void(),
            httpx_response_as_file('a.jpeg'),
        ]
    });

    const out = 1||await httpx({
        url: 'https://echo.vbarbarosh.com',
        method: 'PUT',
        mixins: [
            httpx_request_as_json({a:1,b:2}),
            httpx_response_as_json(),
            httpx_request_progress(function (delta, ready, total) {
                console.log('http_request_progress', delta, ready, total);
            }),
            httpx_response_progress(function (delta, ready, total) {
                console.log('http_response_progress', delta, ready, total);
            }),
        ],
    });
    console.log(out);
}

function http_get_json(url, options = {})
{
    return httpx({
        url,
        headers: options.headers,
        mixins: [
            httpx_request_as_void(),
            httpx_response_as_json(),
            options.progress_upload ? httpx_request_progress(options.progress_upload) : null,
            options.progress_download ? httpx_response_progress(options.progress_download) : null,
        ],
    });
}

function http_post_json(url, data, options = {})
{
    return httpx({
        url,
        method: 'POST',
        headers: options.headers,
        mixins: [
            httpx_request_as_json(data),
            httpx_response_as_json(),
            options.progress_upload ? httpx_request_progress(options.progress_upload) : null,
            options.progress_download ? httpx_response_progress(options.progress_download) : null,
        ],
    });
}

/**
 * A mixin-based approach for working with `http`.
 */
function httpx(params)
{
    return new Promise(async function (resolve, reject) {
        const ctx = {
            url: params.url,
            options: {
                method: params.method,
                headers: params.headers,
            },
            mixins: (params.mixins || []).filter(v => v),
            params,
            resolve,
            reject,
            request: null,
            response: null,
        };
        if (await checkpoint('init')) {
            return;
        }
        ctx.request = (ctx.url.startsWith('http:') ? http : https).request(ctx.url, ctx.options, async function (response) {
            ctx.response = response;
            await checkpoint('response');
        });
        await checkpoint('request') || await checkpoint('send');

        async function checkpoint(checkpoint_name) {
            for (let i = 0, end = ctx.mixins.length; i < end; ++i) {
                switch (await ctx.mixins[i](checkpoint_name, ctx)) {
                case HTTPX_BREAK:
                    return false;
                case HTTPX_DESTROY:
                    ctx.request.destroy();
                    ctx.response.destroy();
                    return true;
                }
            }
            return false;
        }
    });
}

function httpx_retry(maximum_retries = 1)
{
    const retries = [];
    return function (step, ctx) {
        switch (step) {
        case 'response':
            if (ctx.response.statusCode == 200) {
                return;
            }
            retries.push(new Date());
            if (retries.length > maximum_retries) {
                throw new Error('Maximum retries reached');
            }
            httpx(ctx.params).then(ctx.resolve, ctx.reject);
            return HTTPX_DESTROY;
        }
    };
}

function httpx_follow_redirects(maximum_redirects = 5)
{
    const redirects = [];
    return function (step, ctx) {
        switch (step) {
        case 'init':
            if (ctx.options.method && ctx.options.method != 'GET') {
                throw new Error('Only GET methods can follow redirects');
            }
            break;
        case 'response':
            redirects.push(ctx.url);
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections
            if (ctx.response.statusCode == 301 || ctx.response.statusCode == 302) {
                if (redirects.length > maximum_redirects) {
                    throw new Error(`Too many redirects:\n${redirects.join('\n')}`);
                }
                httpx({...ctx.params, url: ctx.response.headers['location']}).then(ctx.resolve, ctx.reject);
                return HTTPX_DESTROY;
            }
            break;
        }
    };
}

function httpx_request_as_void()
{
    return function (step, ctx) {
        switch (step) {
        case 'send':
            ctx.request.end();
            break;
        }
    };
}

function httpx_request_as_json(data)
{
    return function (step, ctx) {
        switch (step) {
        case 'send':
            const json = JSON.stringify(data);
            ctx.request.setHeader('Content-Type', 'application/json');
            ctx.request.setHeader('Content-Length', Buffer.byteLength(json));
            ctx.request.end(json);
            break;
        }
    };
}

function httpx_request_as_file(file)
{
    return async function (step, ctx) {
        switch (step) {
        case 'send':
            const size = await fs_size(file);
            ctx.request.setHeader('Content-Type', 'application/octet-stream');
            ctx.request.setHeader('Content-Length', size);
            ctx.request.on('error', ctx.reject);
            fs_read_stream(file).pipe(ctx.request);
            break;
        }
    };
}

function httpx_response_ignore()
{
    return function (step, ctx) {
        switch (step) {
        case 'response':
            const chunks = [];
            ctx.response.on('error', ctx.reject);
            ctx.response.on('data', function (chunk) {
                if (array_sum(chunks, v => v.length) < 2048) {
                    chunks.push(chunk);
                }
            });
            ctx.response.on('end', function () {
                const s = Buffer.concat(chunks).toString('utf8');
                if (ctx.response.statusCode != 200) {
                    ctx.reject(new Error(`${ctx.response.statusCode} ${ctx.response.statusMessage}\n\n${s.substr(0, 2048)}`.trim()));
                    return;
                }
                ctx.resolve();
            });
            break;
        }
    };
}

function httpx_response_as_file(file)
{
    return function (step, ctx) {
        switch (step) {
        case 'response':
            if (ctx.response.statusCode != 200) {
                ctx.reject(new Error(`${ctx.response.statusCode} ${ctx.response.statusMessage}\n\n${text.substr(0, 2048)}`.trim()));
                return;
            }
            ctx.response.pipe(fs_write_stream(file));
            ctx.response.on('end', ctx.resolve);
            ctx.response.on('error', ctx.reject);
            break;
        }
    };
}

function httpx_response_as_json()
{
    return function (step, ctx) {
        switch (step) {
        case 'request':
            ctx.request.setHeader('Accept', 'application/json, text/plain, */*');
            break;
        case 'response':
            const chunks = [];
            ctx.response.on('error', ctx.reject);
            ctx.response.on('data', chunk => chunks.push(chunk));
            ctx.response.on('end', function () {
                const text = Buffer.concat(chunks).toString('utf8');
                if (ctx.response.statusCode != 200) {
                    ctx.reject(new Error(`${ctx.response.statusCode} ${ctx.response.statusMessage}\n\n${text.substr(0, 2048)}`.trim()));
                    return;
                }
                try {
                    const type = ctx.response.headers['content-type'] || '';
                    if (type.startsWith('application/json')) {
                        ctx.resolve(JSON.parse(text));
                    }
                    else if (type.startsWith('text/')) {
                        ctx.resolve(text);
                    }
                    else {
                        ctx.reject(new Error(`Invalid Content-Type: ${type}\n\n${text.substr(0, 2048)}`.trim()));
                    }
                }
                catch (error) {
                    ctx.reject(error);
                }
            });
        }
    };
}

function httpx_request_progress(fn)
{
    return function (step, ctx) {
        switch (step) {
        case 'request':
            // https://stackoverflow.com/a/39492211/1478566
            const total = ctx.request.getHeader('Content-Length');
            let prev = 0;
            ctx.request.on('drain', function () {
                const ready = ctx.request.socket.bytesWritten;
                const delta = ready - prev;
                fn(delta, ready, total);
                prev = ready;
            });
            break;
        };
    };
}

function httpx_response_progress(fn)
{
    return function (step, ctx) {
        switch (step) {
        case 'response':
            const total = ctx.response.headers['content-length'] || null;
            let ready = 0;
            ctx.response.on('data', function (chunk) {
                const delta = chunk.length;
                ready += delta;
                fn(delta, ready, total);
            });
            break;
        }
    };
}
