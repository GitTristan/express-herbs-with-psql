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
1. Create a "migration" in a new folder `app/migration/createHerbs.js` with the following content:

  ```
  var pg = require('pg');
  var conString = "postgres://emilyplatzer:@localhost/herbs_with_postgresql";

  var client = new pg.Client(conString);
  client.connect();
  var query = client.query('CREATE TABLE herbs(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, oz INTEGER, inStock BOOLEAN)');
  query.on('end', function() { client.end(); });
  ```

  * run this by executing in terminal: `$ node app/migration/createHerbs.js`
1. Verify that this created a table
  * `$ psql -d postgres -U username`
  * `\c herbs_with_postgresql;`
  * `SELECT * FROM herbs`
  * you should see an empty table!
1. Add one herb to our table:
  * `INSERT INTO herbs(name, oz, instock) VALUES ('motherwort', 3, true);`
  * `SELECT * FROM herbs`
  * you should see your new herb added to the table
1. View our herbs on the herb index page
  * edit `/routes/herbs.js`
    * add requires, necessary variables:

      ```
      var pg = require('pg');
      var conString = "postgres://emilyplatzer:@localhost/herbs_with_postgresql"

      var client = new pg.Client(conString)
      ```
    * add route, should end up looking like this:

      ```
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
      ```

  * Add view to `views/herbs/index.jade` with content:

    ```
    extends ../layout

    block content
      h1(class="page-header") Check out my herbs!

      table(class="table")
        thead
          th Herb name
          th Ounces requested
          th In Stock?
        tbody
          each herb in herbs
            tr
              td= herb.name
              td= herb.oz
              td= herb.instock
    ```

1. COMMIT
1. Add new link for herbs in index

  ```
  div(class="page-header")
    a(href="/herbs/new" class="btn btn-success pull-right") Add Herb
    h1 Check out my herbs!
  ```

1. Add route for new herb

  ```
  router.get('/new', function(req, res, next) {
    res.render('herbs/new');
  });
  ```

1. Add view for new herb

  ```
  extends ../layout

  block content
    h1(class="page-header") New Herb

    ol(class="breadcrumb")
      li
        a(href="/herbs") My Herbs
      li(class="active") New

    form(action='/herbs' method='post' class='form-horizontal')

      div(class='form-group')
        label(class="col-sm-2 control-label") Name
        div(class='col-sm-4')
          input(type="text" name="herb[name]" class='form-control')

      div(class="form-group")
        label(class="col-sm-2 control-label") Ounces needed
        div(class="col-sm-4")
          input(type='number' name='herb[oz]' class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          div(class="checkbox")
          label Do you have this herb in stock?
            input(type='checkbox' name='herb[instock]' class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          input(type='submit' name='commit' value='Add this herb' class="btn btn-success")
  ```

1. Add create route

  ```
  router.post('/', function(req, res, next) {
    var herbs = [];
    pg.connect(conString, function(err, client, done) {
      if (err) return console.log(err);
      client.query("INSERT INTO herbs(name, oz, instock) values($1, $2, $3)", [req.body['herb[name]'], req.body['herb[oz]'], req.body['herb[inStock]']]);
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
  ```

1. COMMIT
1. Add link to herb show page

  ```
  td
    a(href="/herbs/#{herb.id}")= herb.name
  ```

1. Add route for herb show

  ```
  router.get('/:id', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
      var herb;
      if (err) return console.log(err);
      var query = client.query("SELECT * FROM herbs WHERE (id = " + req.params.id + ") LIMIT 1");
      query.on('row', function(row) {
        herb = row;
      });
      query.on('end', function() {
        client.end();
        res.render('herbs/show', {herb: herb});
      });
    });
  });
  ```

1. Add view for herb show

  ```
  extends ../layout

  block content
    h1(class="page-header")= herb.name

    ol(class="breadcrumb")
      li
        a(href="/herbs") My Herbs
      li(class="active")= herb.name

    h3 #{herb.oz} Ounces
    if herb.instock
      h3 Available
    else
      h3 Unavailable
  ```

1. COMMIT
1. Add link for herb edit on `views/herbs/index.jade`

  ```
  td
    a(href="/herbs/#{herb.id}/edit" class="btn btn-warning") Edit
  ```

1. Add route for herb edit

  ```
  router.get('/:id/edit', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
      var herb;
      if (err) return console.log(err);
      var query = client.query("SELECT * FROM herbs WHERE (id = " + req.params.id + ") LIMIT 1");
      query.on('row', function(row) {
        herb = row;
      });
      query.on('end', function() {
        client.end();
        res.render('herbs/edit', {herb: herb});
      });
    });
  })
  ```

1. Add view for herb edit

  ```
  extends ../layout

  block content
    h1(class="page-header") Edit #{herb.name}

    ol(class="breadcrumb")
      li
        a(href="/herbs") My Herbs
      li(class="active") Edit

    form(action='/herbs/#{herb.id}' method='post' class='form-horizontal')

      div(class='form-group')
        label(class="col-sm-2 control-label") Name
        div(class='col-sm-4')
          input(type="text" name="herb[name]" value=herb.name class='form-control')

      div(class="form-group")
        label(class="col-sm-2 control-label") Ounces needed
        div(class="col-sm-4")
          input(type='number' name='herb[oz]' value=herb.oz class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          div(class="checkbox")
          label Do you have this herb in stock?
            if herb.instock
              input(type='checkbox' name='herb[inStock]' checked=herb.instock class="form-control")
            else
              input(type='checkbox' name='herb[inStock]' class="form-control")

      div(class="form-group")
        div(class="col-sm-offset-2 col-sm-4")
          input(type='submit' name='commit' value='Update this herb' class="btn btn-success")
  ```

1. Add route for herb Update

  ```
  router.post('/:id', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
      var herbs = [];
      if (err) return console.log(err);
      client.query("UPDATE herbs SET name=($1), oz=($2), instock=($3) WHERE id=($4)", [req.body['herb[name]'], req.body['herb[oz]'], req.body['herb[inStock]'], req.params.id]);
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
  ```
