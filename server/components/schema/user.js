'use strict';

var uuid = require('node-uuid');

module.exports = function () {
  // TODO Finish the user schema file.
  return {
    _id: uuid.v4()
  };
};