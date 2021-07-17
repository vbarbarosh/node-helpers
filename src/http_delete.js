import axios from 'axios';

function http_delete(url, options)
{
    return axios.delete(url, {responseType: 'json', ...options}).then(v => v.data);
}

export default http_delete;
