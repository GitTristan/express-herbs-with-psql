var pg = require('pg');
var conString = "postgres://emilyplatzer:@localhost/herbs_with_postgresql";

var client = new pg.Client(conString);
client.connect();
var query = client.query('CREATE TABLE herbs(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, oz INTEGER, inStock BOOLEAN)');
query.on('end', function() { client.end(); });
