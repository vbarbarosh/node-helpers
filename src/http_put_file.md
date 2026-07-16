PUTs a local file to `url` with an explicit `Content-Length` header (some
services, e.g. S3, reject `Transfer-Encoding: chunked`). Any 2xx status
resolves with `{request, response, data}` where `data` is the response body
as a Buffer; any other status rejects with an error containing the status
line and the response body. Errors reading the file reject too, even when
the request is already in flight.

**Options:**
- `headers` — extra request headers (`Content-Length` is always set).
- `progress_upload(delta, ready, total)` — called on socket drain.
- `progress_download(delta, ready, total)` — called per response chunk;
  `total` is `null` without a response `Content-Length`.

```js
const {response, data} = await http_put_file(signed_url, '/tmp/build.zip');
```
