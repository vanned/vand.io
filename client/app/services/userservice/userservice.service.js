'use strict';

angular.module('vandioApp')
  .service('userservice',['$http', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var userserviceInstance = {
    	login: function(params){
    		return $http.post('/api/user/login',  data: params)
    	}
      
      }
       return userserviceInstance;

  }]);
