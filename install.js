'use strict';

var colors = require('colors');
var settings = require('./server/config/environment');
var db = require('./server/components/database');
var adminDB = require('./server/components/database/admins');
var userDB = require('./server/components/database/users');
var appDB = require('./server/components/database/applications');
var caseDB = require('./server/components/database/cases');

var adminView = require('./server/components/views/admin.json');
var userView = require('./server/components/views/user.json');
var appView = require('./server/components/views/application.json');
var caseView = require('./server/components/views/case.json');

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
      db.create(settings.couchdb.dbs.cases, function (err) {
        if(err && err.statusCode !== 412) {
          console.log('Error creating cases database.'.red);
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
              appDB.insert(caseView, '_design/cases', function (err) {
                // 409 is Document update conflict.
                if(err && err.statusCode !== 409) {
                  console.log('Error inserting cases view.'.red);
                  return console.log(err);
                }
                console.log('DB Installation successful.'.green);
              });
            });
          });
        });
      });
    });
  });
});