'use strict';

angular.module('vandioApp').controller('NavbarCtrl', ['$scope', '$location', '$anchorScroll', '$window', 'adminService', 'userservice', '$mdToast', '$rootScope', function ($scope, $location, $anchorScroll, $window, adminService, userservice, $mdToast, $rootScope) {
  $scope.goToBottom = function () {
    $location.path('/');
    $location.hash('four');
    $anchorScroll();
  };
  if($window.localStorage.getItem('username')) {
    $rootScope.$emit('loggedIn');
  } else {
    $rootScope.$emit('loggedOut');
  }
  $rootScope.$on('loggedIn', function () {
    $scope.loggedIn = true;
  });
  $rootScope.$on('loggedOut', function () {
    $scope.loggedIn = false;
  });
  $scope.logout = function () {
    if($window.localStorage.getItem('isAdmin')) {
      adminService.logout().success(function (adminResp) {
        $mdToast.show(
          $mdToast.simple()
            .content(adminResp.message)
            .position('bottom left')
            .hideDelay(3000)
        );
        $location.path('/admin/login');
        $rootScope.$emit('loggedOut');
        $window.localStorage.clear();
      }).error(function (error, statusCode) {
        $mdToast.show(
          $mdToast.simple()
            .content(error.message)
            .position('bottom left')
            .hideDelay(3000)
        );
      });
    } else {
      userservice.logout().success(function (userResp) {
        $mdToast.show(
          $mdToast.simple()
            .content(userResp.message)
            .position('bottom left')
            .hideDelay(3000)
        );
        $location.path('/user/login');
        $rootScope.$emit('loggedOut');
        $window.localStorage.clear();
      }).error(function (error, statusCode) {
        $mdToast.show(
          $mdToast.simple()
            .content(error.message)
            .position('bottom left')
            .hideDelay(3000)
        );
      });
    }
  };
}]);