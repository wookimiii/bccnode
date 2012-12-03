var express = require('express'),
    path = require('path'),
    mongo = require('mongodb'),
    http = require('http'),
    https = require('https'),
    stylus = require('stylus'),
    _u = require("./underscore-min")

var db = null;
var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/bcc_dev";
console.log(mongoUri)
mongo.connect( mongoUri, {auto_reconnect:true}, dbConnectCallback );
function dbConnectCallback( error, database ){
  db = database;
  db.addListener( "error", function(){console.log('DB Connection failed')} );
};

var app = express();
app.use(express.bodyParser());
app.use(stylus.middleware(
  { 
    src: __dirname + '/assets', 
    dst: __dirname + '/public',
    compile: function(str, path){
      return stylus(str)
      .set('filename', path)
      .use(nib())
      .import('nib');
    }
  }
))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'jade');

var Server = mongo.Server;
var Db = mongo.Db;

var BIBLE = {
  hostname: "bibles.org",
  auth: "aSFqiCqh3zQQ1QgqzMuVzOVBZ1wpQf7rzDXWGE49:X"
}

// var server = new Server('ds043497.mongolab.com', 43497, {auto_reconnect : true});
// var db = new Db('heroku_app7804191', server);

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

// +++ CATECHISMS 

app.get('/shorter-catechisms', function(req, res){
  res.render('catechisms/index');
});

app.get('/shorter-catechisms/new', function(req, res){
  res.render('catechisms/new');
});

app.get('/api/catechisms', function(req, res) {
  var catechisms = db.collection('catechisms');
  catechisms.find().toArray( function(err, docs){
    res.send(docs);
  });
});

app.get('/api/catechisms/delete', function(req, res) {
  var catechisms = db.collection('catechisms');
  catechisms.remove({number:3}, function(){
    res.send('deleted\n');
  });
});


// POST
app.post("/api/catechisms", function(req, res){
  console.log('new catechism');
  verses = req.body.verses
  req.body.verses = []
  var catechisms = db.collection('catechisms');
  catechisms.insert(req.body, function(cat){
    getVerses(req.body.number, verses);
    res.send('saved');
  });
});

function saveVerse(number, json){
  console.log(number);
  db.collection('catechisms').update(
    {number:number}, 
    {$push: {verses: json.passages[0]}}
  )
}
function getVerses(number, verses){
  _u.each(verses, function(verse){
    getVerse(number, verse, saveVerse);
  });
}

function getVerse(number, verse, onSuccess){
  var verseStr = encodeURIComponent(verse)
  var path = "/ESV/passages.json?q[]=" + verseStr
  var options = {
    hostname: BIBLE.hostname,
    auth: BIBLE.auth,
    path:  path,
    method: "GET"
  }
  var request = https.get(options, function(res){
    res.on('data', function(d) {
        json = JSON.parse(d.toString());
        onSuccess(number, json);
      });
    });
  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
}
