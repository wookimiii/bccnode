var express = require('express'),
    path = require('path'),
    mongo = require('mongodb'),
    http = require('http'),
    https = require('https')

var app = express.createServer(express.logger());

var Server = mongo.Server;
var Db = mongo.Db;

var BIBLE = {
  hostname: "bibles.org",
  auth: "aSFqiCqh3zQQ1QgqzMuVzOVBZ1wpQf7rzDXWGE49:X"
}

var server = new Server('ds043497.mongolab.com', 43497, {auto_reconnect : true});
var db = new Db('heroku_app7804191', server);

db.open(function(err, client) {
  client.authenticate('bccweb', 'ilovegod', function(err, success) {
    console.log(err);
    console.log('connected to the db successfully!');
  });
});


app.configure(function() {
  var basePath = path.join(__dirname, '..');
  app.use(require('connect-assets')({build: false, src: basePath + '/assets'}));
  app.use('/assets', express.static(basePath + '/assets'));
  app.use('/img', express.static(basePath + '/assets/images'));
  app.set('views', basePath + '/views');
  app.set('view options', { layout: false });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

app.get('/', function(req, res) {
  console.log("welcome to bcc");
  res.render('index.jade');
});

// Not doing this right now =)
// app.post('/wall/process_email', function(req, res) {
//   console.log(req);
// });

app.get('/shorter-catechisms', function(req, res){
  res.render('catechisms.jade');
});

app.get('/api/catechisms', function(req, res) {
  var catechisms = db.collection('catechisms');
  catechisms.find().toArray( function(err, docs){
    res.send(docs);
  });
});

// POST
app.post("/api/catechisms", function(req, res){
  options = {
    hostname: BIBLE.hostname,
    auth: BIBLE.auth,
    path: "/versions/GNT.json",
    method: "GET"
  }
  console.log(options);
  var request = https.get(options, function(bibleresp){
    bibleresp.on('data', function(d) {
      process.stdout.write(d);
    });
    
  });
  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

});
