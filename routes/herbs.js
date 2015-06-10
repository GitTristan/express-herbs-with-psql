var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://emilyplatzer:@localhost/herbs_with_postgresql";

router.get('/', function(req, res, next) {
  var herbs = [];
  pg.connect(conString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("SELECT * FROM herbs");
    query.on('row', function(row) {
      herbs.push(row);
    });
    query.on('end', function() {
      done();
      res.render('herbs/index', {herbs: herbs});
    });
  });
});

router.get('/new', function(req, res, next) {
  res.render('herbs/new');
});

router.post('/', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("INSERT INTO herbs(name, oz, instock) values($1, $2, $3)", [req.body['herb[name]'], req.body['herb[oz]'], req.body['herb[inStock]']]);
    query.on('end', function() {
      done();
      res.redirect('/herbs');
    });
  });
});

router.get('/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    var herb;
    if (err) return console.log(err);
    var query = client.query("SELECT * FROM herbs WHERE (id = " + req.params.id + ") LIMIT 1");
    query.on('row', function(row) {
      herb = row;
    });
    query.on('end', function() {
      done();
      res.render('herbs/show', {herb: herb});
    });
  });
});

router.get('/:id/edit', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    var herb;
    if (err) return console.log(err);
    var query = client.query("SELECT * FROM herbs WHERE (id = " + req.params.id + ") LIMIT 1");
    query.on('row', function(row) {
      herb = row;
    });
    query.on('end', function() {
      done();
      res.render('herbs/edit', {herb: herb});
    });
  });
})

router.post('/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("UPDATE herbs SET name=($1), oz=($2), instock=($3) WHERE id=($4)", [req.body['herb[name]'], req.body['herb[oz]'], req.body['herb[inStock]'], req.params.id]);
    query.on('end', function() {
      done();
      res.redirect('/herbs');
    });
  });
});

router.get('/:id/delete', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("DELETE FROM herbs WHERE id=" + req.params.id);
    query.on('end', function() {
      done();
      res.redirect('/herbs');
    });
  });
});

module.exports = router;
