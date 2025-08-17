#!/usr/bin/env node

const cli = require('@vbarbarosh/node-helpers/src/cli');
const crypto_hash_md5 = require('@vbarbarosh/node-helpers/src/crypto_hash_md5');
const crypto_hash_sha256 = require('@vbarbarosh/node-helpers/src/crypto_hash_sha256');
const format_thousands = require('@vbarbarosh/node-helpers/src/format_thousands');
const http_put_file = require('@vbarbarosh/node-helpers/src/http_put_file');

cli(main);

async function main()
{
    const tmp = await http_put_file('http://127.0.0.1:3000', '/lipsum/random.100M', {
        progress_upload: function (delta, ready, total) {
            if (total) {
                console.log(new Date(), `progress_upload ${format_thousands(ready)} of ${format_thousands(total)} [+${format_thousands(delta)}] ${(ready/total*100).toFixed(2)}%`);
            }
            else {
                console.log(new Date(), `progress_upload ${format_thousands(ready)} of n/a [+${format_thousands(delta)}]`);
            }
        },
        progress_download: function (delta, ready, total) {
            if (total) {
                console.log(new Date(), `progress_download ${format_thousands(ready)} of ${format_thousands(total)} [+${format_thousands(delta)}] ${(ready/total*100).toFixed(2)}%`);
            }
            else {
                console.log(new Date(), `progress_download ${format_thousands(ready)} of n/a [+${format_thousands(delta)}]`);
            }
        },
    });
    console.log(crypto_hash_md5(tmp.data).toString('hex'));
    console.log(crypto_hash_sha256(tmp.data).toString('hex'));
}
