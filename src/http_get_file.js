import * as fs from 'fs';
import * as stream from 'stream';
import axios from 'axios';
import {promisify} from 'util';

const stream_finished = promisify(stream.finished);

// https://stackoverflow.com/a/61269447
function http_get_file(url, out_file, options)
{
    const ws = fs.createWriteStream(out_file);
    return axios.get(url, {responseType: 'stream', ...options}).then(function (response) {
        return stream_finished(response.data.pipe(ws));
    });
}

export default http_get_file;
