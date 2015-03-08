'use strict';

angular.module('vandioApp')
.controller('UserLoginCtrl', ['$scope', 'userservice', '$mdToast', '$location', '$window', function ($scope, userservice, $mdToast, $location, $window) {

  $scope.login = function () {
    userservice.login({
      username: $scope.user.username,
      password: $scope.user.password
    }).success(function (loginResp) {
      $mdToast.show(
        $mdToast.simple()
          .content(loginResp.message)
          .position('bottom left')
          .hideDelay(3000)
      );
      $window.localStorage.setItem('isAdmin', false);
      $window.localStorage.setItem('username', $scope.user.username);
      $location.path('/user/profile');
    }).error(function (error, statusCode) {
      $mdToast.show(
        $mdToast.simple()
          .content(error.message)
          .position('bottom left')
          .hideDelay(3000)
      );
    });
  };
}]);
