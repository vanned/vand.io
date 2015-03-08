'use strict';

var validator = require('validator');

var settings = require('../../config/environment');
var caseDB = require('../../components/database/cases');

// Get a case from the database.
exports.index = function(req, res) {
  var id = req.query.id;
  var getAllCases = false;
  if(validator.isNull(id)) {
    getAllCases = true;
  }
  if(!getAllCases) {
    if(!validator.isUUID(id, 4)) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    caseDB.searchByKey('by_id', id, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get requested case(s).'});
      }
      if(reply.rows.length === 0) {
        return res.status(400).jsonp({message: 'Case does not exist.'});
      }
      var caseRes = reply.rows[0].value;
      delete caseRes._rev;
      return res.jsonp([caseRes]);
    });
  } else {
    var username = req.session.username || req.query.username;
    caseDB.searchByKey('by_username', username, function (error, reply) {
      if(error) {
        console.log(error);
        return res.status(500).jsonp({message: 'Could not get requested case(s).'});
      }
      var cases = reply.rows.map(function (row) {
        delete row.value._rev;
        return row.value;
      });
      return res.jsonp(cases);
    });
  }
};