# README

### How I made this

1. `$ express herbs-with-postgresql`
1. `$ cd herbs-with-postgresql`
1. COMMIT
1. Create README and take notes
1. Add `"pg": "~4.3.0",` to `package.json` dependencies
1. `$ npm install`
1. Create `.gitignore` with content `node_modules/**`
1. Create a postgres database with same name as app
  * log into postgres CLI replacing username with your postgres username
    * `$ psql -d postgres -U username`
  * create database
    * if you use `-` in your app name, replace with underscores `_`
    * `=# CREATE DATABASE herbs_with_postgresql;`
1. Add the following to `app.js`, but:
  * replacing `username` with your postgres username
  * replacing password with postgres password
  * if you use `-` in your app name, replace with underscores `_`

  ```
  var pg = require('pg');

  var conString = "postgres://username:password@localhost/herbs_with_postgresql";

  var client = new pg.Client(conString);
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log("PostgreSQL is totally hooking it up: ", result.rows[0].theTime);
      client.end();
    });
  });
  ```
1. Fire up that server, and see if you have any errors...
  * `DEBUG=herbs-with-postgresql:* npm start`
1. COMMIT `.gitignore`, them commit the rest
