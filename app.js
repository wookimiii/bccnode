var express = require('express');
var path = require('path');
var stylus = require('stylus');

/**
 * Handlers
**/
var catechisms = require('./handlers/catechisms.js');

/**
 * Initialize the express app
**/
var app = express();
app.use(express.bodyParser());

/**
 * middleware
**/
app.use(stylus.middleware({ 
    src: __dirname + '/assets', 
    dst: __dirname + '/public',
    compile: function (str, path) {
        return stylus(str)
        .set('filename', path)
        .use(nib())
        .import('nib');
    }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view cache', true);
app.set('etag', false);

/**
 * Use the public directory for assests
**/ 
app.use(express.static(__dirname + '/public'))

app.configure(function() {
    var basePath = __dirname;
    app.use(require('connect-assets')({build: false, src: basePath + '/assets'}));
    app.use('/assets', express.static(basePath + '/assets'));
    app.use('/img', express.static(basePath + '/assets/images'));
    app.use('/font', express.static(basePath + '/assets/font'));
    app.set('view options', { layout: false });
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

/**
 * Routes
**/
app.get('/', function(req, res) {
    console.log("Welcome to BCC");
    res.render('index');
});

// +++ CATECHISMS 
app.get('/shorter-catechisms', catechisms.index);
app.get('/shorter-catechisms/new', catechisms.newForm);
app.post("/api/catechisms", catechisms.create);
app.get('/api/catechisms', catechisms.all);


module.exports = app
