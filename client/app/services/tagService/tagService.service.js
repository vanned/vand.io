'use strict';

angular.module('vandioApp').service('tagService', ['$http', function ($http) {
  return {
    getTags: function () {
      return $http({
        method: 'GET',
        url: '/api/tags'
      });
    }
  };
}]);
