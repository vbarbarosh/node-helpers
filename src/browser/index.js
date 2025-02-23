// https://github.com/webpack/webpack/issues/625
// https://webpack.js.org/guides/dependency-management/#require-context
const require_tmp = require.context('..', true, /\b(array|date|http_delete|http_get_blob|http_get_buffer|http_get_json|http_get_utf8|http_head|http_patch_json|http_post_json|http_post_multipart|http_put_buffer|http_put_json|http_put_utf8|identity|ignore|format)[^/]*(?<!\.test)\.js$/);
require_tmp.keys().forEach(function (key) {
    const [, basename] = key.match(/([^/]+)\.js$/);
    window[basename] = require_tmp(key);
});
