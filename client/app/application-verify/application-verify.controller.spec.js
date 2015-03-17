'use strict';

describe('Controller: ApplicationVerifyCtrl', function () {

  // load the controller's module
  beforeEach(module('vandioApp'));

  var ApplicationVerifyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationVerifyCtrl = $controller('ApplicationVerifyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
