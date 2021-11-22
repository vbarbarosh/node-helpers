import fs from 'fs';
import fs_size from './fs_size';
import http from 'http';
import https from 'https';

async function http_put_file(url, file, options)
{
    // <?xml version="1.0" encoding="UTF-8"?>
    // <Error>
    //   <Code>NotImplemented</Code>
    //   <Message>A header you provided implies functionality that is not implemented</Message>
    //   <Header>Transfer-Encoding</Header>
    //   <RequestId>XXXXXXXXXX</RequestId>
    //   <HostId>YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY</HostId>
    // </Error>

    const total = await fs_size(file);
    return new Promise(function (resolve, reject) {
        const chunks = [];
        const request = (url.startsWith('http:') ? http : https).request(url, {method: 'PUT', headers: {'Content-Length': total}}, function (response) {
            response.on('error', reject);
            if (options.progress_download) {
                const total_download = response.headers['content-length'] ? parseInt(response.headers['content-length']) : null;
                let ready = 0;
                response.on('data', function (chunk) {
                    const delta = chunk.length;
                    ready += delta;
                    options.progress_download(delta, ready, total_download);
                });
            }
            response.on('data', function (chunk) {
                chunks.push(chunk);
            });
            response.on('end', function () {
                switch (response.statusCode) {
                case 200:
                    resolve({request, response, data: Buffer.concat(chunks)});
                    break;
                default:
                    reject(new Error(`${response.statusCode} ${response.statusMessage}\n\n${Buffer.concat(chunks).toString('utf8')}`));
                    break;
                }
            });
        });
        request.on('error', reject);
        // https://stackoverflow.com/a/39492211/1478566
        if (options.progress_upload) {
            let prev = 0;
            request.on('drain', function () {
                const ready = request.socket.bytesWritten;
                const delta = ready - prev;
                options.progress_upload(delta, ready, total);
                prev = ready;
            });
        }
        fs.createReadStream(file).pipe(request);
    });
}

export default http_put_file;
