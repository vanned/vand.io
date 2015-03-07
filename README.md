Vand.io
=======

Sharing Forensic Evidence w/ Private & Public Sectors

[![Build Status](https://travis-ci.org/vanned/vand.io.svg?branch=master)](https://travis-ci.org/vanned/vand.io)
[![Dependency Status](https://david-dm.org/vanned/vand.io.svg)](https://david-dm.org/vanned/vand.io)
[![Built with Yeoman](https://pixel-cookers.github.io/built-with-badges/yeoman/yeoman-long.png)](http://yeoman.io)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Built with Bower](https://pixel-cookers.github.io/built-with-badges/bower/bower-short.png)](http://bower.io/)
[![Built with Node](https://pixel-cookers.github.io/built-with-badges/node/node-short.png)](http://nodejs.org/)
[![Built with Angular](https://pixel-cookers.github.io/built-with-badges/angular/angular-short.png)](https://angularjs.org/)


API Docs
-------------
* [Production](https://www.vand.io/api/docs/)
* [Dev](http://localhost:9000/api/docs/)

TODO
---------
* [Here](TODO.md)

Dependencies
------------

* [NodeJS](http://nodejs.org/)
* [CouchDB](http://couchdb.apache.org/)

Development
-----------

```bash
$ git clone <repo url> /path/to/dump/repo
$ cd /path/to/repo

# Start up DB
$ couchdb

# Set environment variable for development temporarily in Mac OSX/Linux
$ export NODE_ENV=development
# or temporarily on Windows
$ set NODE_ENV=development
# or permanently on MAC OSX
$ echo "export NODE_ENV=development" >> vim ~/.profile
# or permanently on Linux
$ echo "export NODE_ENV=development" >> vim ~/.bashrc

# Install server-side dependencies
$ npm install

# Don't forget to edit your configuration files at server/config/environment

# Install client-side dependencies
$ bower install

# Development server startup
$ grunt serve

# Start coding! :D

# Build just API Docs
$ grunt apidoc

# Build just TODO List
$ grunt todo
```

Standardize Development
------------------------

```bash
# Install NodeJS (http://nodejs.org)
# Install Yeoman (http://yeoman.io)
$ npm install -g yo

# Install the fullstack generator
$ npm install -g generator-angular-fullstack

# Utilize generators for endpoints
$ yo angular-fullstack:endpoint myEndpoint
# Edit directory of endpoint drop
$ mv server/api/path/to/endpoint server/api/new/path/to/endpoint
# Utilize routes for front-end.
$ yo angular-fullstack:route myRoute

# See https://github.com/DaftMonk/generator-angular-fullstack#generators for full list.
```

Testing
------

```bash
$ grunt test
```

Production
----------

```bash
# Build for production
$ grunt
# If the build hangs on testing try this instead.
$ grunt build

$ mv ./dist /path/to/production/location && cd /path/to/production/location

# Install dependencies
$ npm install

# Check NODE_ENV variable value is set
$ echo $NODE_ENV
# If above line results in an empty line then set environment variable for production
$ export NODE_ENV=production

# Use Node to run for production
$ export IP=127.0.0.1
$ export PORT=9000
$ node server/app.js

# Or use forever for production (https://github.com/nodejitsu/forever)
$ export IP=127.0.0.1
$ export PORT=9000
$ forever start server/app.js
```

Heroku Production
----------------

```bash
# Build for production
$ grunt
# If the build hangs on testing try this instead.
$ grunt build
$ cd dist

# Create Heroku application via https://dashboard.heroku.com/apps
# Add Redis To-Go to application.

# Add git remote to distribution folder
$ git remote add heroku git@heroku.com:app-name.git

# Edit production settings file
$ vim server/config/environment/production.js

# Add config variables to Heroku config list
heroku config:add NODE_ENV=production
heroku config:add DOMAIN=app-name.herokuapp.com
heroku config:add HEROKU_COOKIE_SECRET=MYSECRET

# Add files, commit and push
git add ./*
git commit -m "My message"
git push heroku master

# View Site! :)
```