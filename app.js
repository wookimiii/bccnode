var express = require('express');
var path = require('path');
var stylus = require('stylus');
var assets = require('connect-assets')();

/**
 * Handlers
**/
var catechisms = require('./handlers/catechisms.js');

/**
 * Initialize the express app
**/
var app = express();
app.use(express.bodyParser());

app.use(assets);

/**
 * Jade Templates
**/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view cache', true);
app.set('etag', false);

/**
 * Use the public directory for assests
**/ 
app.use(express.static(__dirname + '/public'))

/**
 * Application port
 * Heroku uses process.env.PORT
**/
var port = process.env.PORT || 5000;


/**
 * Start the server
**/ 
app.listen(port, function() {
  console.log("Listening on " + port);
});

/**
 * Routes
**/
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/sermon/new', function (req, res) {
    res.render('sermon/new');
});

// +++ CATECHISMS 
app.get('/shorter-catechisms', catechisms.index);
app.get('/shorter-catechisms/new', catechisms.newForm);
app.post("/api/catechisms", catechisms.create);
app.get('/api/catechisms', catechisms.all);

module.exports = app
