var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://emilyplatzer:@localhost/herbs_with_postgresql";

var client = new pg.Client(conString);

/* GET herbs listing. */
router.get('/', function(req, res, next) {
  var herbs = [];
  pg.connect(conString, function(err, client, done) {
    if (err) return console.log(err);
    var query = client.query("SELECT * FROM herbs");
    query.on('row', function(row) {
      herbs.push(row);
    });
    query.on('end', function() {
      client.end();
      res.render('herbs/index', {herbs: herbs});
    });
  });
});

module.exports = router;
