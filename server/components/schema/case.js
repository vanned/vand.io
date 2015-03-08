'use strict';

module.exports = function () {
  return {
    _id: null,
    username: null,
    created: null,
    views: 0,
    tags: [],
    category: null,
    description: null,
    evidences: [],
    ratings: {
      up: 1,
      down: 0
    }
  };
};