import axios from 'axios';
import qs from 'querystring';

function http_post_urlencoded(url, body, options)
{
    return axios.post(url, qs.stringify(body), options).then(v => v.data);
}

export default http_post_urlencoded;
