'use strict';

angular.module('vandioApp').controller('AdminLoginCtrl', ['$scope', 'adminService', '$mdToast', '$location', '$window', function ($scope, adminService, $mdToast, $location, $window) {
  $scope.admin = {};

  $scope.login = function () {
    adminService.login({
      username: $scope.admin.username,
      password: $scope.admin.password
    }).success(function (loginResp) {
      $mdToast.show(
        $mdToast.simple()
          .content(loginResp.message)
          .position('bottom left')
          .hideDelay(3000)
      );
      $window.localStorage.setItem('isAdmin', true);
      $window.localStorage.setItem('username', $scope.admin.username);
      $location.path('/admin/profile');
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
