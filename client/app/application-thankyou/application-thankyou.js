'use strict';

angular.module('vandioApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/thankyou', {
        templateUrl: 'app/application-thankyou/application-thankyou.html',
        controller: 'AppThankYouCtrl'
      });
  });