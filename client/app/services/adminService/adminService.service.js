'use strict';

angular.module('vandioApp').service('adminService', ['$http', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return  {
      login: function (loginResp) {
        return $http({
          method: 'POST',
          url: '/api/admin/login',
          data: loginResp
        });
      },
      logout: function () {
        return $http({
          method: 'GET',
          url: '/api/admin/logout'
        });
      }
    };
}]);
