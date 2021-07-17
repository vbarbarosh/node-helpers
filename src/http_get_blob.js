import axios from 'axios';

function http_get_blob(url, options)
{
    return axios.get(url, {responseType: 'blob', ...options}).then(v => v.data);
}

export default http_get_blob;
