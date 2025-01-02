const htmlparser2 = require('htmlparser2');
const stream = require('stream');

/**
 * Consume XML, produce an object with analytics about provided xml stream.
 */
function stream_xml_analyze()
{
    let out;
    const path = [];
    let path_str = '';
    let analytics = {};

    const options = {xmlMode: true};
    const events = {
        onopentag: function (name, attrs) {
            path.push(name);
            path_str = path.join(' > ');
            analytics[path_str] ??= 0;
            analytics[path_str]++;
        },
        onclosetag: function (name) {
            path.pop();
        },
        ontext: function (text) {
        },
        onend: function () {
            out.push(analytics);
        },
    };

    const parser = new htmlparser2.Parser(events, options);
    return out = new stream.Transform({
        objectMode: true,
        transform: function (buf, encoding, callback) {
            parser.write(buf.toString());
            callback();
        },
        flush: function (callback) {
            parser.end();
            callback();
        },
    });
}

module.exports = stream_xml_analyze;
