const ns = new URL(document.currentScript.src).searchParams.get('var') ?? 'h';
if (typeof window[ns] !== 'undefined') {
    console.log(`❌ @vbarbarosh/node-helpers@${__VERSION__} was not injected — window.${ns} is already in use`);
}
else {
    console.log(`🎉 @vbarbarosh/node-helpers@${__VERSION__} successfully exposed as window.${ns}`);
    window[ns] = {};
    // https://github.com/webpack/webpack/issues/625
    // https://webpack.js.org/guides/dependency-management/#require-context
    const require_tmp = require.context('..', true, /^(?!.*(cli-apps|browser|\.d)\/).*\b(array|date|http_delete|http_get_blob|http_get_buffer|http_get_json|http_get_utf8|http_head|http_patch_json|http_post_json|http_post_multipart|http_put_buffer|http_put_json|http_put_utf8|identity|ignore|fcmp|filter|format|plural|random_int|urlmod|waitcb)[^/]*(?<!\.test)\.js$/);
    require_tmp.keys().forEach(function (key) {
        const [, basename] = key.match(/([^/]+)\.js$/);
        window[ns][basename] = require_tmp(key);
    });
}
