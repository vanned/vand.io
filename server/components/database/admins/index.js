'use strict';

var settings = require('../../../config/environment');
var nano = require('nano')(settings.couchdb.url);
var adminDB = nano.use(settings.couchdb.dbs.admins);

exports.insert = function (data, key, callback) {
  adminDB.insert(data, key, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAllReduced = function (callback) {
  adminDB.view('admins', 'all', {reduce: true}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAll = function (callback) {
  adminDB.view('admins', 'all', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByKey = function (view, key, callback) {
  adminDB.view('admins', view, {reduce: false, key: key}, function (error, body, headers) {
    if(error) {
      return callback(errorr);
    }
    return callback(null, body);
  });
};

exports.searchByKeys = function (view, keys, callback) {
  adminDB.view('admins', view, {reduce: false, keys: keys}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.compact = function (callback) {
  nano.db.compact(settings.couchdb.dbs.admins, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.delete = function (key, rev, callback) {
  adminDB.destroy(key, rev, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.deleteBulk = function (docs, callback) {
  adminDB.bulk({docs: docs}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};