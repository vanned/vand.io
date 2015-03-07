'use strict';

module.exports = function () {
  return {
    _id: null,
    email: null,
    username: null,
    tokens: {
        register: null,
        reset: null
    },
    password: null,
    active: false,
    created: null,
    activated: null
  };
};