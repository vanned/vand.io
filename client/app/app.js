'use strict';

angular.module('vandioApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'noCAPTCHA',
  'ngMaterial'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
}]);