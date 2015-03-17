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
    },
    status: function (id) {
      return $http({
        method: 'GET',
        url: '/api/application/status',
        params: {id: id}
      });
    },
    verify: function (params) {
      return $http({
        method: 'POST',
        url: '/api/application/verify',
        data: params
      });
    }
  };
}]);
