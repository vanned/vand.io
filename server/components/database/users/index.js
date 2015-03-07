'use strict';

var settings = require('../../../config/environment');
var nano = require('nano')(settings.couchdb.url);
var userDB = nano.use(settings.couchdb.dbs.users);

exports.insert = function (data, key, callback) {
  userDB.insert(data, key, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAllReduced = function (callback) {
  userDB.view('users', 'all', {reduce: true}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAll = function (callback) {
  userDB.view('users', 'all', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByKey = function (view, key, callback) {
  userDB.view('users', view, {reduce: false, key: key}, function (error, body, headers) {
    if(error) {
      return callback(errorr);
    }
    return callback(null, body);
  });
};

exports.searchByKeys = function (view, keys, callback) {
  userDB.view('users', view, {reduce: false, keys: keys}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.compact = function (callback) {
  nano.db.compact(settings.couchdb.dbs.users, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.delete = function (key, rev, callback) {
  userDB.destroy(key, rev, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.deleteBulk = function (docs, callback) {
  userDB.bulk({docs: docs}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};