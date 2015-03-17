'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/application/:id/verify', {
        templateUrl: 'app/application-verify/application-verify.html',
        controller: 'ApplicationVerifyCtrl'
      });
  });
