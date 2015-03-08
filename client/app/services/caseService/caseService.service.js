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
    },
    openCase: function (params) {
      var fd = new FormData();
      fd.append('file', params.file);
      fd.append('category', params.category);
      fd.append('description', params.description);
      for (var i = 0; i < params.tags.length; i++) {
        var tag = params.tags[i];
        fd.append('tags', tag);
      }
      console.log(fd);
      return $http({
        method: 'POST',
        url: '/api/case/open',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });
    }
  };
}]);
