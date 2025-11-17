// PHP’s strtr tries the longest possible key first when multiple keys overlap.
// echo strtr("hello", ["he" => "X", "hell" => "Y"]);
function strtr(subject, map)
{
    let out = subject;
    Object.entries(map).sort(fcmp).forEach(function ([search, replace]) {
        out = out.replaceAll(search, replace);
    });
    return out;
    function fcmp(b, a) {
        return a[0].length - b[0].length;
    }
}

module.exports = strtr;
