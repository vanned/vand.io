'use strict';

var settings = require('../../config/environment');
var nano = require('nano')(settings.couchdb.url);
var users = require('./users');
var admins = require('./admins');
var cases = require('./cases');

exports.users = users;
exports.admins = admins;
exports.cases = cases;

exports.create = function (dbName, callback) {
  nano.db.create(dbName, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};