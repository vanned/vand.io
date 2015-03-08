'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/application/:ID', {
        templateUrl: 'app/application-form/application-form.html',
        controller: 'AppFormCtrl'
      });
  });