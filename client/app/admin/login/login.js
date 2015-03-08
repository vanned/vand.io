'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/login', {
        templateUrl: 'app/admin/login/login.html',
        controller: 'AdminLoginCtrl'
      });
  });
