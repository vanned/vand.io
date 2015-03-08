'use strict';

var settings = require('../../../config/environment');
var nano = require('nano')(settings.couchdb.url);
var appDB = nano.use(settings.couchdb.dbs.applications);

exports.insert = function (data, key, callback) {
  appDB.insert(data, key, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAllReduced = function (callback) {
  appDB.view('applications', 'all', {reduce: true}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByAll = function (callback) {
  appDB.view('applications', 'all', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByApproved = function (callback) {
  appDB.view('applications', 'by_approved', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByUnapproved = function (callback) {
  appDB.view('applications', 'by_unapproved', {reduce: false}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByKey = function (view, key, callback) {
  appDB.view('applications', view, {reduce: false, key: key}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.searchByKeys = function (view, keys, callback) {
  appDB.view('applications', view, {reduce: false, keys: keys}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.compact = function (callback) {
  nano.db.compact(settings.couchdb.dbs.applications, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.delete = function (key, rev, callback) {
  appDB.destroy(key, rev, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};

exports.deleteBulk = function (docs, callback) {
  appDB.bulk({docs: docs}, function (error, body, headers) {
    if(error) {
      return callback(error);
    }
    return callback(null, body);
  });
};