'use strict';

angular.module('vandioApp')
.controller('UserLoginCtrl', ['$scope', 'userservice', '$mdToast', '$location', function ($scope, userservice, $mdToast, $location) {
  $scope.login = function () {
    userservice.login({
      username: $scope.user.username,
      password: $scope.user.password
    }).success(function (data) {
      $location.path('/user/home');
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
