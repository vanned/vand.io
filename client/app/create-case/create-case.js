'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/createcase', {
        templateUrl: 'app/create-case/create-case.html',
        controller: 'createCaseController'
      });
  });