const zlib  = require('zlib');

function stream_gunzip(options)
{
    return zlib.createGunzip(options);
}

module.exports = stream_gunzip;
