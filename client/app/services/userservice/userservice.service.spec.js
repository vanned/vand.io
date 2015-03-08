'use strict';

describe('Service: userservice', function () {

  // load the service's module
  beforeEach(module('vandioApp'));

  // instantiate service
  var userservice;
  beforeEach(inject(function (_userservice_) {
    userservice = _userservice_;
  }));

  it('should do something', function () {
    expect(!!userservice).toBe(true);
  });

});
