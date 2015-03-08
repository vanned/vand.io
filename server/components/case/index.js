'use strict';

var AWS = require('aws-sdk');
var moment = require('moment');
var uuid = require('node-uuid');
var async = require('async');
var kue = require('kue');
var fs = require('fs');
var jobs = kue.createQueue();
var settings = require('../../config/environment');
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: settings.amazon.aws.s3.accessKeyId,
  secretAccessKey: settings.amazon.aws.s3.secretAccessKey,
  region: 'us-west-1',
  sslEnabled: true,
  paramValidation: true,
  computeChecksums: true
});

var caseRes = require('../../components/schema/case')();
var caseDB = require('../../components/database/cases');

/**
 * Upload S3 files and create the new case object.
 * @return {Function} The job callback function
 */
exports.upload = function () {
  jobs.process('createCase', function (job, done) {
    // Initialize the job progress.
    job.progress(1, 100);
    // Get data from creation.
    var files = job.data.files;
    var category = job.data.category;
    var tags = job.data.tags;
    var description = job.data.description;
    var username = job.data.username;
    var filenames = Object.keys(files);
    var locations = [];
    var count = 0;
    // For each file, upload to S3.
    async.each(filenames, function (fieldname, cb) {
      count++;
      var params = {
        // TODO Change this to an authenticated-read so we can make sure other people outside the website can't see them.
        ACL: 'public-read',
        Bucket: settings.amazon.aws.s3.bucket,
        Key: files[fieldname].filename,
        Body: new Buffer(files[fieldname].buffer),
        ContentType: files[fieldname].mimetype,
        ContentLength: files[fieldname].size,
      };
      s3.upload(params, function (error, data) {
        if(error) {
          console.log(error);
          return cb(error);
        }
        // Update progress.
        job.progress((count / filenames.length * 90), 100);
        locations.push(data.Location);
        return cb(null);
      });
    }, function (error) {
      if(error) {
        console.log(error);
        return done(error);
      }
      // Create new case.
      caseRes._id = uuid.v4();
      caseRes.category = category;
      caseRes.tags = tags;
      caseRes.description = description;
      caseRes.created = moment.utc().valueOf();
      caseRes.evidences = locations;
      // Insert the case into database.
      caseDB.insert(caseRes, caseRes._id, function (error) {
        if(error) {
          console.log(error);
          return done(error);
        }
        job.progress(99, 100);
        done();
      });
    });
  });
};