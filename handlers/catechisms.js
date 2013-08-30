'use strict';

/**
 * Main view for the catechisms
**/
var index = function(req, res){
  res.render('catechisms/index');
};

/**
 * Form for creating a new catechism
**/ 
var newForm = function (req, res) {
    res.render('catechisms/new');
};

/**
 * Create a catechism
**/
var create = function (req, res) {
    var catechism = req.body;
    var verses = catechism.verses;
    catechism.verses = [];

    catechism.create(catechism, function (err, res) {
        res.send('saved');
    });
};

/**
 * All the catechisms in JSON
**/
var all = function(req, res) {
    catechisms.all(function (err, docs) {
        res.send(docs);
    });
};

module.exports = {
    index: index,
    create: create,
    newForm: newForm,
    all: all
}
