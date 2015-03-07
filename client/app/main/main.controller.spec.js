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

  it('should expect 1 to be 1', function () {
    expect(1).toBe(1);
  });
});
