'use strict';

angular.module('vandioApp').service('applicationService', ['$http', function ($http) {
  return {
    update: function (params) {
      return $http({
        method: 'POST',
        url: '/api/application',
        data: params
      });
    },
    getAll: function () {
      return $http({
        method: 'GET',
        url: '/api/application'
      });
    },
    approved: function (params) {
      return $http({
        method: 'POST',
        url: '/api/application/approved',
        data: params
      });
    }
  };
}]);
