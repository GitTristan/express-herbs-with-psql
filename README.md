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
1. Change `users` to `herbs`
  * In `app.js` change `var users = require('./routes/users');` to:
    * `var herbs = require('./routes/herbs');`
  * and change `app.use('/users', users);` to:
    * `app.use('/herbs', herbs);`
  * In `routes/`, rename `users.js` to `herbs.js`
1. Stop and start server, and visit `http://localhost:3000/herbs` to ensure all is well.
1. COMMIT
1. Add bootstrap
  * go to [http://getbootstrap.com/getting-started/#download](http://getbootstrap.com/getting-started/#download) and click on "Download Bootstrap" (zip file)
  * unzip, and rename file to just `bootstrap`
  * move this directory to `/public`
  * restart server and open [http://localhost:3000/](http://localhost:3000/)
  * require bootstrap in `/views/layout/jade`, contents of head should be:

    ```
    title= title
    link(rel='stylesheet', href='/bootstrap/css/bootstrap.min.css')
    link(rel='stylesheet', href='/bootstrap/css/bootstrap-responsive.min.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
    script(src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js')
    script(src='/bootstrap/js/bootstrap.min.js')
    ```

  * refresh index... you should see the font change. Bootstrap is now loading!
1. COMMIT
