'use strict';

var mongo = require('mongodb');
var http = require('http');
var _ = require('underscore');

var db = null;
var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/bcc_dev";

console.log(mongoUri)
mongo.connect( mongoUri, {auto_reconnect:true}, dbConnectCallback );

function dbConnectCallback( error, database ){
  db = database;
  db.addListener( "error", function(){console.log('DB Connection failed')} );
};


var Server = mongo.Server;
var Db = mongo.Db;

var BIBLE = {
  hostname: "bibles.org",
  auth: "aSFqiCqh3zQQ1QgqzMuVzOVBZ1wpQf7rzDXWGE49:X"
}

/**
 * Create a catechism
**/
var create = function (catechism, cb) {
    var catechisms = db.collection('catechisms');
    catechisms.insert(req.body, function(cat){
        getVerses(req.body.number, verses);
        cb();
    });
};

var getAll = function (cb) {
    var catechisms = db.collection('catechisms');
    catechisms.find().sort({number:1}).toArray(cb);
}

/**
 * Save a verse for a catechism to the DB
**/
function saveVerse(number, index, json){
    console.log(json);
    var hsh = {text:"", reference:null}
    _.each(json, function(v){
        v.text = v.text.replace(/<(p*)\b[^>]*>/, '');
        v.text = v.text.replace("</p>", "<hr/>");
        hsh.text += "<sup>" + v.verse + "</sup>" + v.text
    });

    hsh.reference = json[0].bookname + " " + json[0].chapter + ":" + json[0].verse
    if(json.length > 1)
        hsh.reference = hsh.reference + "-" + _.last(json).verse
    hsh.order = index

    db.collection('catechisms').update(
        {number:number}, 
        {$push: {verses: hsh}}
    )
}

/**
 * For a catechism, get the verses
 * number: catechism number
 * verses: array of verse references ['John 3:16']
**/
function getVerses(number, verses){
    _.each(verses, function(verse, i){
        getVerse(number, i, verse, saveVerse);
    });
}

/**
 * Fetch a verse from the Bible API
**/
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

module.exporsts  = {
    getAll: getAll,
    create: create
}
