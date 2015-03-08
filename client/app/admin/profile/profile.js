'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/profile', {
        templateUrl: 'app/admin/profile/profile.html',
        controller: 'AdminProfileCtrl'
      });
  });
