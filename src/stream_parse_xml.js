const stream = require('stream');
const htmlparser2 = require('htmlparser2');

/**
 * Parse XML stream and produce objects.
 */
function stream_parse_xml(selector, mapper = stream_parse_xml.makeobj)
{
    let out;
    let elem = {name: '#doc', parent: null, attrs: {}, text: [], children: [], raw: []};

    const path = [];
    const selector_str = selector.join('>');
    let path_str = '';

    const options = {xmlMode: true};
    const events = {
        onopentag: function (name, attrs) {
            elem = {name, parent: elem, attrs, text: [], children: [], raw: []};
            if (path.length > 1) {
                elem.parent.raw.push(elem);
                elem.parent.children.push(elem);
            }
            path.push(elem.name);
            path_str = path.join('>');
        },
        onclosetag: function (name) {
            if (path_str === selector_str) {
                out.push(mapper(elem));
            }
            elem = elem.parent;
            path.pop();
            path_str = path.join('>');
        },
        ontext: function (text) {
            elem.raw.push(text);
            elem.text.push(text);
        },
        onend: function () {
            if (selector_str === '') {
                out.push(mapper(elem));
            }
        },
    };

    const parser = new htmlparser2.Parser(events, options);
    return out = new stream.Transform({
        objectMode: true,
        transform: function (buf, encoding, next) {
            parser.write(buf.toString());
            next();
        },
    });
}

stream_parse_xml.makeobj = function (node) {
    if (node.children.length === 0) {
        return node.text.join('').trim();
    }
    const out = {};
    node.children.forEach(function (child) {
        out[child.name] = stream_parse_xml.makeobj(child);
    });
    return out;
}

module.exports = stream_parse_xml;
