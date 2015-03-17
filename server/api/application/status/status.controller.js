'use strict';

var kue = require('kue');
var moment = require('moment');

function _checkJobLife(lastUpdated, state, error) {
  var lastUpdated = moment.utc(lastUpdated);
  var now = moment();
  if(state === 'complete' && !error) {
    return false;
  } else if (now.diff(lastUpdated) >= 1800000) {
    return true;
  } else if(state === 'complete' && error) {
    return true;
  } else if(state === 'failed') {
    return true;
  }
  return false;
}

// Get status of a job.
exports.index = function(req, res) {
  kue.Job.get(req.query.id, function (error, job) {
    if(error) {
      return res.status(400).jsonp({message: 'Invalid id.'});
    }
    var isStale = _checkJobLife(parseInt(job.updated_at), job.state(), job.error());
    if(isStale) {
      job.remove(function (error) {
        if(error) {
          return res.status(500).jsonp({message: 'Issue retreiving job status.'});
        }
        return res.jsonp({progress: job.progress(), message: null});
      });
    } else if (job.state() === 'complete') {
      var result = job.result;
      return res.jsonp({progress: job.progress(), message: result});
    } else {
      return res.jsonp({progress: job.progress(), message: null});
    }
  });
};