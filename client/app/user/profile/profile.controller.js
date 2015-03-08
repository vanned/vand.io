'use strict';

angular.module('vandioApp').controller('UserProfileCtrl', ['$scope', '$window', '$mdToast', 'caseService', '$location', function ($scope, $window, $mdToast, caseService, $location) {
  $scope.username = $window.localStorage.getItem('username') || null;
  caseService.getCasesForUser($scope.username).success(function (caseResp) {
    $scope.cases = caseResp;
  }).error(function (error, statusCode) {
    $mdToast.show(
      $mdToast.simple()
        .content(error.message)
        .position('bottom left')
        .hideDelay(3000)
      );
  });
  $scope.addCase = function () {
    $location.path('/user/createcase');
  };
 }]);
