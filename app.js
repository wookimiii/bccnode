var http = require('http')
var fs = require('fs');
var st = require('st');

var mount = st({ path: __dirname + '/public', url: '/assets' })
var server = http.createServer(function (req, res) {
    // static assets
    if (mount(req, res)) return;

    console.log(req.url);
    if (req.url === "/") {
        // index.html
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile("./views/index.html", function(err, data) {
            if (err) throw err;
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end(req.url + "Not Found");
    }
});

var port = process.env.PORT || 5000;
server.listen(port);
console.log("Listening on port: " + port);

module.exports = server;
