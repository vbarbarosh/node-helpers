// https://stackoverflow.com/a/46787467

const Throttle = require('throttle');
const http = require('http');

const server = http.createServer(function (req, res) {
    console.log(req.method, req.url, req.headers);
    console.log();
    res.statusCode = 200;
    req.headers['content-type'] && res.setHeader('Content-Type', req.headers['content-type']);
    req.headers['content-length'] && res.setHeader('Content-Length', req.headers['content-length']);
    // noinspection JSCheckFunctionSignatures
    req.pipe(new Throttle(5*1024*1024)).pipe(res);
});

server.listen(3000, function () {
    const {address, port} = this.address();
    console.log(`Server running at ${address}:${port}`);
    console.log();
});
