'use strict';

angular.module('vandioApp')
.service('userservice',['$http', function ($http) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  return {
    login: function(params) {
        return $http({
          method: 'POST',
          url: '/api/user/login',
          data: params
        });
    },
    register: function (registerData) {
      return $http({
        method: 'POST',
        url: '/api/user/apply',
        data: registerData
      });
    },
    logout: function () {
      return $http({
        method: 'GET',
        url: '/api/user/logout'
      });
    }
  };
}]);
