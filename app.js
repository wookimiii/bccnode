var http = require('http')

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('hello world');
});

var port = process.env.PORT || 5000;
server.listen(port);
console.log("Listening on port: " + port);

module.exports = server;
