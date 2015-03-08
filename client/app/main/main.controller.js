'use strict';

angular.module('vandioApp').controller('MainCtrl', ['$scope', 'userservice', '$mdToast', '$anchorScroll', '$location', function ($scope, userservice, $mdToast, $anchorScroll, $location) {
  $scope.isLoading = false;
  $scope.register = function () {
    $scope.isLoading = true;
    userservice.register({
      email: $scope.email,
      captcha: $scope.gRecaptchaResponse
    }).success(function (registerResp) {
      $scope.isLoading = false;
      $mdToast.show(
        $mdToast.simple()
          .content(registerResp.message)
          .position('bottom left')
          .hideDelay(3000)
      );
      $location.hash('top');
      $anchorScroll();
    }).error(function (error, statusCode) {
      $scope.isLoading = false;
      $mdToast.show(
        $mdToast.simple()
          .content(error.message)
          .position('bottom left')
          .hideDelay(3000)
      );
      $location.hash('top');
      $anchorScroll();
    });
  }
}]);
