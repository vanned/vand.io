'use strict';

var colors = require('colors');
var settings = require('./server/config/environment');
var db = require('./server/components/database');
var adminDB = require('./server/components/database/admins');
var userDB = require('./server/components/database/users');
var appDB = require('./server/components/database/applications');

var adminView = require('./server/components/views/admin.json');
var userView = require('./server/components/views/user.json');
var appView = require('./server/components/views/application.json');

db.create(settings.couchdb.dbs.admins, function (err) {
  if(err && err.statusCode !== 412) {
    console.log('Error creating admins database.'.red);
    return console.log(err);
  }
  db.create(settings.couchdb.dbs.users, function (err) {
    if(err && err.statusCode !== 412) {
      console.log('Error creating users database.'.red);
      return console.log(err);
    }
    db.create(settings.couchdb.dbs.applications, function (err) {
      if(err && err.statusCode !== 412) {
        console.log('Error creating application database.'.red);
        return console.log(err);
      }
      adminDB.insert(adminView, '_design/admins', function (err) {
        // 409 is Document update conflict.
        if(err && err.statusCode !== 409) {
          console.log('Error inserting admin view.'.red);
          return console.log(err);
        }
        userDB.insert(userView, '_design/users', function (err) {
          // 409 is Document update conflict.
          if(err && err.statusCode !== 409) {
            console.log('Error inserting user view.'.red);
            return console.log(err);
          }
          appDB.insert(appView, '_design/applications', function (err) {
            // 409 is Document update conflict.
            if(err && err.statusCode !== 409) {
              console.log('Error inserting application view.'.red);
              return console.log(err);
            }
            console.log('DB Installation successful.'.green);
          });
        });
      });
    });
  });
});