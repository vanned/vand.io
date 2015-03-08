'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/application/:id', {
        templateUrl: 'app/application-form/application-form.html',
        controller: 'AppFormCtrl'
      });
  });