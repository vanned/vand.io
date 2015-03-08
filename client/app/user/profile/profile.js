'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/profile', {
        templateUrl: 'app/user/profile/profile.html',
        controller: 'UserProfileCtrl'
      });
  });
