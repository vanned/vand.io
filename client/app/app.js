'use strict';

angular.module('vandioApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'noCAPTCHA',
  'ngMaterial',
  'angularMoment'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
}]).run(['$rootScope', '$window', '$location', function ($rootScope, $window, $location) {
  $rootScope.$on('$locationChangeStart', function (newState, oldState) {
    if(!$window.localStorage.getItem('isAdmin') && $location.path().indexOf('admin') !== -1) {
      $location.path('/admin/login');
    }
  });
}]);