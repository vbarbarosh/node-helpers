// PHP’s strtr tries the longest possible key first when multiple keys overlap.
// echo strtr("hello", ["he" => "X", "hell" => "Y"]);
function strtr(subject, map)
{
    // Single pass, like PHP: replaced text is never scanned again
    const keys = Object.keys(map).filter(v => v.length).sort(fcmp);
    let out = '';
    for (let i = 0; i < subject.length; ) {
        const key = keys.find(v => subject.startsWith(v, i));
        if (key) {
            out += map[key];
            i += key.length;
        }
        else {
            out += subject[i];
            i++;
        }
    }
    return out;
    function fcmp(b, a) {
        return a.length - b.length;
    }
}

module.exports = strtr;
