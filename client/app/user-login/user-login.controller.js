'use strict';

angular.module('vandioApp').controller('UserLoginCtrl', ['$scope','userservice' function ($scope) {

	$scope.login = function(){

		userservice.login({username:user.email,password:user.password})
		.success(){
			console.log("login successful");
		}

		userservice.login({username:user.email,password:user.password})
		.error(){
			console.log("login failed");				
		}
	};


}]);
