'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('vandioApp'));

  var MainCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should check that 1 is 1', function () {
    expect(1).toBe(1);
  });
});
