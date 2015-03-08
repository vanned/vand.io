'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/login', {
        templateUrl: 'app/user-login/user-login.html',
        controller: 'UserLoginCtrl'
      });
  });