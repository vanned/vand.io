'use strict';

var _ = require('lodash');

var caseDB = require('../../components/database/cases');

// Get all the tags from the case database.
exports.index = function(req, res) {
  caseDB.searchByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.status(500).jsonp({message: 'Could not get the tags.'});
    }
    if(reply.rows.length === 0) {
      return res.status(400).jsonp({message: 'No cases in the database.'});
    }
    var cases = reply.rows.map(function (row) {
      return row.value;
    });
    console.log(cases);
    var tags = cases.map(function (caseRes) {
      return caseRes.tags;
    }).reduce(function (a, b) {
      return a.concat(b);
    });
    tags = _.unique(tags);
    return res.jsonp(tags);
  });
};