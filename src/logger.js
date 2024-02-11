const NotImplemented = require('./errors/NotImplemented');

// grep_cle1grnu10000tu72diepbfet
const re = /^((?:\[\s*[^\]]*\])*)\s*(.*)$/m;

/**
 * log = logger();
 * log.add('hey')
 * log.add('[tag] heyhey')
 */
function logger(options = {})
{
    function out(message) {
        const v = typeof message === 'string' ? JSON.stringify(message.trim()).slice(1, -1) : JSON.stringify(message);
        const [, a, m] = v.match(re);
        const time = new Date().toJSON();
        console.log(`${a} ${m}`.trim());
    };
    out.spawn = function () {
        throw new NotImplemented();
    };
    return out;
}

module.exports = logger;
