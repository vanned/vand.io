'use strict';

var settings = require('../../../config/environment');
var nano = require('nano')(settings.couchdb.url);
var caseDB = nano.use(settings.couchdb.dbs.cases);

exports.insert = function (data, key, callback) {
  caseDB.insert(data, key, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAllReduced = function (callback) {
  caseDB.view('cases', 'all', {reduce: true}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAll = function (callback) {
  caseDB.view('cases', 'all', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByKey = function (view, key, callback) {
  caseDB.view('cases', view, {reduce: false, key: key}, function (error, body, headers) {
    if(error) {
      return callback(errorr);
    }
    return callback(null, body);
  });
};

exports.searchByKeys = function (view, keys, callback) {
  caseDB.view('cases', view, {reduce: false, keys: keys}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.compact = function (callback) {
  nano.db.compact(settings.couchdb.dbs.cases, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.delete = function (key, rev, callback) {
  caseDB.destroy(key, rev, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.deleteBulk = function (docs, callback) {
  caseDB.bulk({docs: docs}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};