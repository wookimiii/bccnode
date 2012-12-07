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
  app.use('/font', express.static(basePath + '/assets/font'));
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
  catechisms.find().sort({number:1}).toArray( function(err, docs){
    res.send(docs);
  });
});

// app.get('/api/catechisms/delete', function(req, res) {
//   var catechisms = db.collection('catechisms');
//   catechisms.remove({}, function(){
//     res.send('deleted\n');
//   });
// });


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

function saveVerse(number, index, json){
  console.log(json);
  var hsh = {text:"", reference:null}
  _u.each(json, function(v){
    v.text = v.text.replace(/<(p*)\b[^>]*>/, '');
    v.text = v.text.replace("</p>", "<hr/>");
    hsh.text += "<sup>" + v.verse + "</sup>" + v.text
  });
  hsh.reference = json[0].bookname + " " + json[0].chapter + ":" + json[0].verse
  if(json.length > 1)
    hsh.reference = hsh.reference + "-" + _u.last(json).verse
  hsh.order = index
  db.collection('catechisms').update(
    {number:number}, 
    {$push: {verses: hsh}}
  )
}
function getVerses(number, verses){
  _u.each(verses, function(verse, i){
    getVerse(number, i, verse, saveVerse);
  });
}

function getVerse(number, index, verse, onSuccess){
  var verseStr = encodeURIComponent(verse)
  var path = "/ESV/passages.json?q[]=" + verseStr
  var path = "/api/?type=json&formatting=para&passage=" + verseStr
  var options = {
    hostname: "labs.bible.org",
    path:  path,
    method: "GET"
  }
  console.log(path);
  var data = '';
  var request = http.get(options, function(res){
    res.on('data', function(d) {
      data += d.toString();
    });
    res.on('end', function(){
      var json = JSON.parse(data);
      console.log(index);
      onSuccess(number, index, json);
    });
  });
  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
}
