const const_stream = require('./const_stream');
const htmlparser2 = require('htmlparser2');
const stream = require('stream');

/**
 * Consume XML, produce objects.
 */
function stream_parse_xml(selector, mapper = stream_parse_xml.guess)
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
            elem.parent.raw.push(elem);
            elem.parent.children.push(elem);
            path.push(elem.name);
            path_str = path.join('>');
        },
        onclosetag: function (name) {
            if (path_str === selector_str) {
                const tmp = mapper(elem);
                out.push((tmp === null ? const_stream.null : tmp));
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
                const tmp = mapper(elem);
                out.push((tmp === null ? const_stream.null : tmp));
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
        flush: function (next) {
            parser.end();
            next();
        },
    });
}

function guess(node)
{
    const attrs = Object.keys(node.attrs);

    if (attrs.length === 0) {
        if (node.raw.length === 0) {
            return null;
        }
        if (node.children.length === 0) {
            return node.text.join('').trim();
        }
        if (node.children.length > 1) {
            const tmp = node.children[0].name;
            if (node.children.every(v => v.name === tmp)) {
                return node.children.map(v => stream_parse_xml.guess);
            }
        }
    }

    const out = {...node.attrs};

    if (node.text.length) {
        const tmp = node.text.join('').trim();
        if (tmp) {
            out.value = tmp;
        }
    }

    node.children.forEach(function (child) {
        const tmp = stream_parse_xml.guess(child);
        if (child.name in out) {
            if (Array.isArray(out[child.name])) {
                out[child.name].push(tmp);
            }
            else {
                out[child.name] = [out[child.name], tmp];
            }
        }
        else  {
            out[child.name] = tmp;
        }
    });

    return out;
}

function ashtml(node)
{
    return node.raw.map(fn).filter(v => v).join('').trim();
    function fn(item) {
        if (typeof item === 'string') {
            return item.replace(/\s+/g, ' ');
        }
        return `<${item.name}>${ashtml(item)}</${item.name}>` ;
    }
}

stream_parse_xml.guess = guess;
stream_parse_xml.ashtml = ashtml;

module.exports = stream_parse_xml;
