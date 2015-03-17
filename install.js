'use strict';

var colors = require('colors');
var AWS = require('aws-sdk');
var settings = require('./server/config/environment');
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: settings.amazon.aws.s3.accessKeyId,
  secretAccessKey: settings.amazon.aws.s3.secretAccessKey,
  region: 'us-west-1',
  sslEnabled: true,
  paramValidation: true
});
var db = require('./server/components/database');
var adminDB = require('./server/components/database/admins');
var userDB = require('./server/components/database/users');
var appDB = require('./server/components/database/applications');
var caseDB = require('./server/components/database/cases');

var adminView = require('./server/components/views/admin.json');
var userView = require('./server/components/views/user.json');
var appView = require('./server/components/views/application.json');
var caseView = require('./server/components/views/case.json');

/**
 * Kick off the Amazon S3 Workflow
 * @param  {Function} callback The callback function.
 * @return {Function} The callback function.
 */
function _s3Workflow (callback) {
  console.log('Getting Amazon buckets.'.yellow);
  s3.listBuckets(function (error, bucketData) {
    if(error) {
      return callback(error);
    }
    // Get buckets.
    var buckets = bucketData.Buckets;
    var bucketNames = buckets.map(function (bucket) {
      return bucket.Name;
    });
    // Get index for the bucket we want to use for our site.
    var bucketIndex = bucketNames.indexOf(settings.amazon.aws.s3.bucket);
    var bucketLocation;
    if(bucketIndex === -1) {
      // Create bucket if we don't already have it.
      var params = {
        Bucket: settings.amazon.aws.s3.bucket,
        ACL: 'public-read',
        CreateBucketConfiguration: {
          LocationConstraint: 'us-west-1'
        }
      };
      console.log('Creating Amazon bucket.'.yellow);
      s3.createBucket(params, function (error, data) {
        if(error) {
          return callback(error);
        }
        console.log('Amazon bucket created.'.green);
        return callback(null);
      });
    } else {
      console.log('Amazon Bucket already exists.'.green);
      return callback(null);
    }
  });
}

_s3Workflow(function () {
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
                caseDB.insert(caseView, '_design/cases', function (err) {
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
});