'use strict';

describe('Service: applicationService', function () {

  // load the service's module
  beforeEach(module('vandioApp'));

  // instantiate service
  var applicationService;
  beforeEach(inject(function (_applicationService_) {
    applicationService = _applicationService_;
  }));

  it('should do something', function () {
    expect(!!applicationService).toBe(true);
  });

});
