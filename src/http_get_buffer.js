import axios from 'axios';

function http_get_buffer(url, options)
{
    return axios.get(url, {responseType: 'arraybuffer', ...options}).then(v => v.data);
}

export default http_get_buffer;
