'use strict';

angular.module('vandioApp').service('caseService', ['$http', function ($http) {
  return {
    getCase: function (id) {
      return $http({
        method: 'GET',
        url: '/api/case?id=' + id
      });
    },
    getCasesForUser: function (username) {
      return $http({
        method: 'GET',
        url: '/api/case'
      });
    }
  };
}]);
