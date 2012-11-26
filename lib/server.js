var express = require('express'),
    path = require('path');

var app = express.createServer(express.logger());

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

app.post('/wall/process_email', function(req, res) {
  console.log(req);
});


app.get('/catechisms', function(req, res) {
  console.log(req)


}
