'use strict';

angular.module('vandioApp').controller('AppFormCtrl', ['$scope',  function ($scope) {
	$scope.submitApplication = function(){
		console.log($scope.application);
	}
}]);

