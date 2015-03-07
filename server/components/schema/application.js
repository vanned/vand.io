'use strict';

module.exports = function () {
  return {
    _id: null,
    email: null,
    company: {
      name: null,
      website: null
    },
    appointment: {
      inPerson: false,
      coordinator: {
        firstname: null,
        lastname: null,
        phonenumber: null,
        email: null,
      },
      useKeybase: false,
      keybase: {
        username: null,
        domain: null
      },
      date: null
    },
    created: null,
    updated: null,
    approved: false
  };
};