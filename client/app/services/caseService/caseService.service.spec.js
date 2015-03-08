'use strict';

describe('Service: caseService', function () {

  // load the service's module
  beforeEach(module('vandioApp'));

  // instantiate service
  var caseService;
  beforeEach(inject(function (_caseService_) {
    caseService = _caseService_;
  }));

  it('should do something', function () {
    expect(!!caseService).toBe(true);
  });

});
